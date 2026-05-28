#!/usr/bin/env python3
import argparse
import html
import mimetypes
import os
import re
from pathlib import Path
from typing import Dict, List
from urllib.parse import unquote, urlparse

import requests

CATEGORY_URLS = {
    "wheelchairs": "https://wheelchair.uz/product-category/wheelchairs/",
    "walkers": "https://wheelchair.uz/product-category/walkers/",
    "canes": "https://wheelchair.uz/product-category/canes-crutches/",
}


def strip_html(raw: str) -> str:
    text = re.sub(r"<br\\s*/?>", "\n", raw, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def slug_from_url(url: str) -> str:
    path = unquote(urlparse(url).path).rstrip("/")
    return path.split("/")[-1].lower()


def product_links(category_url: str) -> List[str]:
    resp = requests.get(category_url, timeout=25)
    resp.raise_for_status()
    links = re.findall(r'href=["\']([^"\']+/product/[^"\']+)["\']', resp.text)
    uniq = []
    seen = set()
    for link in links:
        if link not in seen:
            seen.add(link)
            uniq.append(link)
    return uniq


def parse_product(product_url: str, category_slug: str) -> Dict:
    resp = requests.get(product_url, timeout=25)
    resp.raise_for_status()
    page = resp.text

    title_match = re.search(r'<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>(.*?)</h1>', page, re.S)
    title = strip_html(title_match.group(1) if title_match else slug_from_url(product_url))

    short_match = re.search(r'woocommerce-product-details__short-description[^>]*>(.*?)</div>', page, re.S)
    excerpt = strip_html(short_match.group(1)) if short_match else title

    desc_match = re.search(r'id="tab-description"[^>]*>(.*?)</div>\\s*</div>', page, re.S)
    description = strip_html(desc_match.group(1)) if desc_match else excerpt

    imgs = re.findall(r'data-large_image="([^"]+)"', page)
    if not imgs:
        imgs = re.findall(r'<img[^>]+src="([^"]+)"', page)
    images = []
    for img in imgs:
        if "/wp-content/uploads/" not in img:
            continue
        if img not in images:
            images.append(img)

    sku = f"WCUZ-{abs(hash(product_url)) % 10_000_000:07d}"
    slug = slug_from_url(product_url)

    return {
        "source_url": product_url,
        "slug": slug,
        "sku": sku,
        "title": title,
        "excerpt": excerpt[:250] if excerpt else title,
        "description": description or excerpt or title,
        "category_slug": category_slug,
        "images": images,
    }


def api_login(base_url: str, email: str, password: str) -> str:
    resp = requests.post(
        f"{base_url}/auth/login",
        json={"email": email, "password": password},
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def media_upload(base_url: str, token: str, image_url: str, tmp_dir: Path) -> str:
    img_data = requests.get(image_url, timeout=30).content
    ext = os.path.splitext(urlparse(image_url).path)[-1] or ".jpg"
    tmp_file = tmp_dir / f"tmp{ext}"
    tmp_file.write_bytes(img_data)
    with tmp_file.open("rb") as fh:
        mimetype = mimetypes.guess_type(tmp_file.name)[0] or "image/jpeg"
        resp = requests.post(
            f"{base_url}/media/upload",
            headers={"Authorization": f"Bearer {token}"},
            files={"file": (tmp_file.name, fh, mimetype)},
            timeout=60,
        )
    if resp.status_code >= 400:
        raise RuntimeError(f"media upload failed {resp.status_code}: {resp.text}")
    return resp.json()["url"]


def fetch_category_ids(base_url: str) -> Dict[str, str]:
    resp = requests.get(f"{base_url}/categories", timeout=20)
    resp.raise_for_status()
    rows = resp.json()
    return {row["slug"]: row["id"] for row in rows}


def existing_slugs(base_url: str, token: str) -> set:
    # Some builds return 500 for /products/admin/all; public list is enough for dedupe.
    resp = requests.get(
        f"{base_url}/products?limit=1000",
        headers={"Authorization": f"Bearer {token}"},
        timeout=25,
    )
    resp.raise_for_status()
    return {row.get("slug") for row in resp.json().get("data", []) if row.get("slug")}


def create_product(base_url: str, token: str, payload: Dict):
    resp = requests.post(
        f"{base_url}/products",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=30,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"product create failed {resp.status_code}: {resp.text}")
    return resp.json()


def list_products(base_url: str) -> Dict[str, Dict]:
    resp = requests.get(f"{base_url}/products?limit=1000", timeout=25)
    resp.raise_for_status()
    return {row.get("slug"): row for row in resp.json().get("data", []) if row.get("slug")}


def update_product(base_url: str, token: str, product_id: str, payload: Dict):
    resp = requests.put(
        f"{base_url}/products/{product_id}",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=30,
    )
    if resp.status_code >= 400:
        raise RuntimeError(f"product update failed {resp.status_code}: {resp.text}")
    return resp.json()


def run(base_url: str, email: str, password: str, apply_changes: bool, update_existing: bool):
    token = api_login(base_url, email, password)
    cat_ids = fetch_category_ids(base_url)
    found = []
    for slug, url in CATEGORY_URLS.items():
        links = product_links(url)
        for link in links:
            found.append(parse_product(link, slug))

    print(f"Found {len(found)} source products from 3 categories")
    if not apply_changes:
        for p in found:
            print(f"- {p['slug']} ({p['category_slug']}) images={len(p['images'])}")
        print("Dry run only. Use --apply to import.")
        return

    existing = existing_slugs(base_url, token)
    existing_map = list_products(base_url)
    imported = 0
    skipped = 0
    failed = 0

    with requests.Session() as _:
        tmp_dir = Path("/tmp/wheelchair_import")
        tmp_dir.mkdir(parents=True, exist_ok=True)
        for p in found:
            if p["slug"] in existing:
                if not update_existing:
                    skipped += 1
                    print(f"SKIP {p['slug']} (exists)")
                    continue
                current = existing_map.get(p["slug"])
                if not current:
                    skipped += 1
                    print(f"SKIP {p['slug']} (exists but not in public list)")
                    continue
                if current.get("mainImage") and current.get("images"):
                    skipped += 1
                    print(f"SKIP {p['slug']} (already has images)")
                    continue
                try:
                    uploaded_urls = []
                    for source_img in p["images"][:8]:
                        try:
                            uploaded_urls.append(media_upload(base_url, token, source_img, tmp_dir))
                        except Exception as img_err:
                            print(f"  IMG_FAIL {p['slug']} {source_img}: {img_err}")
                    if not uploaded_urls:
                        skipped += 1
                        print(f"SKIP {p['slug']} (no images uploaded)")
                        continue
                    update_payload = {
                        "mainImage": uploaded_urls[0],
                        "images": uploaded_urls,
                    }
                    update_product(base_url, token, current["id"], update_payload)
                    imported += 1
                    print(f"UPD  {p['slug']}")
                except Exception as err:
                    failed += 1
                    print(f"FAIL {p['slug']}: {err}")
                continue
            try:
                uploaded_urls = []
                for source_img in p["images"][:8]:
                    try:
                        uploaded_urls.append(media_upload(base_url, token, source_img, tmp_dir))
                    except Exception as img_err:
                        print(f"  IMG_FAIL {p['slug']} {source_img}: {img_err}")
                main_image = uploaded_urls[0] if uploaded_urls else None
                payload = {
                    "slug": p["slug"],
                    "sku": p["sku"],
                    "categoryId": cat_ids.get(p["category_slug"]),
                    "price": 0,
                    "name": {"uz": p["title"], "ru": p["title"], "en": p["title"]},
                    "excerpt": {"uz": p["excerpt"], "ru": p["excerpt"], "en": p["excerpt"]},
                    "description": {"uz": p["description"], "ru": p["description"], "en": p["description"]},
                    "mainImage": main_image,
                    "images": uploaded_urls,
                    "isActive": True,
                    "isFeatured": False,
                    "tags": [],
                    "specs": [],
                }
                create_product(base_url, token, payload)
                imported += 1
                print(f"OK   {p['slug']}")
            except Exception as err:
                failed += 1
                print(f"FAIL {p['slug']}: {err}")

    print(f"Done. imported={imported}, skipped={skipped}, failed={failed}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import products from wheelchair.uz category pages")
    parser.add_argument("--api-base", default="http://127.0.0.1:3000/api/v1")
    parser.add_argument("--admin-email", default=os.getenv("ADMIN_EMAIL", "admin@wheelchair.uz"))
    parser.add_argument("--admin-password", default=os.getenv("ADMIN_PASSWORD", "admin123"))
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--update-existing", action="store_true")
    args = parser.parse_args()
    run(args.api_base, args.admin_email, args.admin_password, args.apply, args.update_existing)
