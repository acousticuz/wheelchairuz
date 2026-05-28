#!/usr/bin/env python3
import argparse
import time
from typing import Dict

import requests


def api_login(base_url: str, email: str, password: str) -> str:
    resp = requests.post(
        f"{base_url}/auth/login",
        json={"email": email, "password": password},
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def list_products(base_url: str):
    resp = requests.get(f"{base_url}/products?limit=1000", timeout=25)
    resp.raise_for_status()
    return resp.json().get("data", [])


def _translate_chunk_google(chunk: str, source: str, target: str) -> str:
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": source,
        "tl": target,
        "dt": "t",
        "q": chunk,
    }
    last_err = None
    for attempt in range(4):
        try:
            resp = requests.get(url, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            return "".join(part[0] for part in data[0] if part and part[0]).strip()
        except Exception as err:
            last_err = err
            time.sleep(1.2 * (attempt + 1))
    raise last_err


def split_text(text: str, max_len: int = 350) -> list:
    cleaned = " ".join(text.split())
    if len(cleaned) <= max_len:
        return [cleaned]
    parts = []
    cur = []
    cur_len = 0
    for sentence in cleaned.replace("!", ".").replace("?", ".").split("."):
        s = sentence.strip()
        if not s:
            continue
        s = s + "."
        if cur_len + len(s) + 1 > max_len and cur:
            parts.append(" ".join(cur))
            cur = [s]
            cur_len = len(s)
        else:
            cur.append(s)
            cur_len += len(s) + 1
    if cur:
        parts.append(" ".join(cur))
    return parts or [cleaned]


def translate_text(text: str, source: str, target: str) -> str:
    if not text:
        return text
    if source == target:
        return text
    out_chunks = []
    for chunk in split_text(text):
        out_chunks.append(_translate_chunk_google(chunk, source, target))
        time.sleep(0.15)
    out = " ".join(out_chunks).strip()
    return out or text


def choose_source_lang(value_obj: Dict[str, str]) -> str:
    # Imported data currently is RU in all fields, but keep safe fallback.
    if value_obj.get("ru"):
        return "ru"
    if value_obj.get("uz"):
        return "uz"
    return "en"


def build_i18n_field(value_obj: Dict[str, str]) -> Dict[str, str]:
    src_lang = choose_source_lang(value_obj)
    src_text = (value_obj.get(src_lang) or "").strip()
    if not src_text:
        return {"uz": "", "ru": "", "en": ""}

    ru_text = src_text if src_lang == "ru" else translate_text(src_text, src_lang, "ru")
    time.sleep(0.2)
    uz_text = src_text if src_lang == "uz" else translate_text(src_text, src_lang, "uz")
    time.sleep(0.2)
    en_text = src_text if src_lang == "en" else translate_text(src_text, src_lang, "en")
    time.sleep(0.2)
    return {"uz": uz_text, "ru": ru_text, "en": en_text}


def update_product(base_url: str, token: str, product_id: str, payload: Dict):
    resp = requests.put(
        f"{base_url}/products/{product_id}",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def run(api_base: str, email: str, password: str, apply_changes: bool, limit: int):
    token = api_login(api_base, email, password)
    rows = list_products(api_base)
    if limit > 0:
        rows = rows[:limit]
    print(f"Found {len(rows)} products")

    changed = 0
    failed = 0
    for p in rows:
        try:
            name = build_i18n_field(p.get("name") or {})
            excerpt = build_i18n_field(p.get("excerpt") or {})
            description = build_i18n_field(p.get("description") or {})
            if not apply_changes:
                print(f"DRY {p.get('slug')} | uz={name['uz'][:30]} | en={name['en'][:30]}")
                continue
            payload = {
                "slug": p.get("slug"),
                "sku": p.get("sku"),
                "categoryId": p.get("categoryId"),
                "price": p.get("price", 0),
                "name": name,
                "excerpt": excerpt,
                "description": description,
                "mainImage": p.get("mainImage"),
                "images": p.get("images") or [],
                "isActive": p.get("isActive", True),
                "isFeatured": p.get("isFeatured", False),
                "tags": p.get("tags") or [],
                "specs": p.get("specs") or [],
            }
            update_product(api_base, token, p["id"], payload)
            changed += 1
            print(f"OK  {p.get('slug')}")
        except Exception as err:
            failed += 1
            print(f"FAIL {p.get('slug')}: {err}")

    print(f"Done. changed={changed}, failed={failed}, apply={apply_changes}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Auto-translate products to uz/ru/en")
    parser.add_argument("--api-base", default="http://127.0.0.1:3000/api/v1")
    parser.add_argument("--admin-email", default="admin@wheelchair.uz")
    parser.add_argument("--admin-password", default="admin123")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()
    run(args.api_base, args.admin_email, args.admin_password, args.apply, args.limit)
