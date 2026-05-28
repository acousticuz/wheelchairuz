#!/usr/bin/env python3
import json
import re
import uuid
from pathlib import Path


INPUT_PATH = Path("/home/admin1/wheelchairuz/scripts/uzum-shop-sayqal-products.json")
OUTPUT_PATH = Path("/home/admin1/wheelchairuz/scripts/uzum-mobility-products-converted.json")


MOBILITY_KEYWORDS = [
    "коляск",
    "ходунок",
    "трость",
    "костыл",
    "роллатор",
    "ролатор",
    "rollator",
    "скутер",
    "инвалид",
]


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "")).strip()


def clean_title(raw_title: str) -> str:
    title = normalize_space(raw_title)
    title = title.replace("Uzum Market", "").strip()
    title = re.sub(r"\s+за\s+\d[\d\s]*\s*сум.*$", "", title, flags=re.IGNORECASE)
    title = re.sub(r"\s+по\s+лучшей\s+цене.*$", "", title, flags=re.IGNORECASE)
    return title.strip(" .,-")


def extract_excerpt(raw_description: str) -> str:
    description = normalize_space(raw_description)
    description = description.replace("Uzum Market", "").strip()
    description = re.sub(r"\s+✅\s+Проверенное качество.*$", "", description, flags=re.IGNORECASE)
    return description[:260].rstrip()


def infer_category(text: str) -> str:
    t = text.lower()
    if any(k in t for k in ["трость", "костыл"]):
        return "canes-crutches"
    if any(k in t for k in ["ходунок", "роллатор", "ролатор", "rollator"]):
        return "walkers"
    if any(k in t for k in ["коляск", "скутер", "инвалид"]):
        return "wheelchairs"
    return "support"


def extract_price(text: str) -> int:
    m = re.search(r"за\s+(\d[\d\s]*)\s*сум", text.lower())
    if not m:
        return 0
    return int(m.group(1).replace(" ", ""))


def is_mobility_product(title: str, description: str) -> bool:
    hay = f"{title} {description}".lower()
    return any(k in hay for k in MOBILITY_KEYWORDS)


def slug_from_url(url: str) -> str:
    path = url.split("?")[0].rstrip("/")
    return path.rsplit("/", 1)[-1]


def sku_from_slug(slug: str) -> str:
    digits = re.search(r"(\d{5,})$", slug)
    if digits:
        return f"WCUZ-{digits.group(1)[-7:]}"
    return f"WCUZ-{abs(hash(slug)) % 10_000_000:07d}"


def main():
    source = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
    rows = source.get("products", [])

    converted = []
    for item in rows:
        raw_title = item.get("title", "")
        raw_desc = item.get("description", "")
        if not is_mobility_product(raw_title, raw_desc):
            continue

        slug = slug_from_url(item.get("sourceUrl", ""))
        title = clean_title(raw_title)
        description = normalize_space(raw_desc)
        excerpt = extract_excerpt(raw_desc)
        category_slug = infer_category(f"{title} {description}")
        price = extract_price(f"{raw_title} {raw_desc}")

        converted.append(
            {
                "id": str(uuid.uuid4()),
                "slug": slug,
                "sku": sku_from_slug(slug),
                "category_slug": category_slug,
                "name_ru": title,
                "name_uz": "",
                "name_en": "",
                "excerpt_ru": excerpt,
                "excerpt_uz": "",
                "excerpt_en": "",
                "description_ru": description,
                "description_uz": "",
                "description_en": "",
                "price": price,
                "mainImage": item.get("image", ""),
                "sourceUrl": item.get("sourceUrl", ""),
            }
        )

    out = {
        "source_file": str(INPUT_PATH),
        "total_input": len(rows),
        "total_mobility_products": len(converted),
        "products": converted,
    }
    OUTPUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Converted {len(converted)} of {len(rows)} products -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
