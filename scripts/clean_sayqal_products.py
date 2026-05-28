#!/usr/bin/env python3
import json
import re
from pathlib import Path


INPUT_PATH = Path("/home/admin1/wheelchairuz/scripts/sayqal-20-products-ru-uz-full.json")
OUTPUT_PATH = Path("/home/admin1/wheelchairuz/scripts/sayqal-20-products-cleaned.json")


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def clean_name(text: str) -> str:
    t = norm(text)
    t = re.sub(r"\s+за\s+\d[\d\s]*\s*сум.*$", "", t, flags=re.IGNORECASE)
    t = re.sub(r"\s+по\s+лучшей\s+цене\.?$", "", t, flags=re.IGNORECASE)
    return t.strip(" .,-")


def clean_description(text: str) -> str:
    t = norm(text)
    t = re.sub(r"\s+с\s+быстрой\s+доставкой\.\s*", " ", t, flags=re.IGNORECASE)
    t = re.sub(r"\s*⭐.*$", "", t)
    t = re.sub(r"\s*✅.*$", "", t)
    t = re.sub(r"\s+Доставка\s+от\s+1\s+дня.*$", "", t, flags=re.IGNORECASE)
    t = re.sub(r"\s+Рассрочка\s+до\s+24\s+месяцев.*$", "", t, flags=re.IGNORECASE)
    return t.strip(" .,-")


def clean_images(images):
    if not isinstance(images, list):
        return []
    # Keep only full original product images
    filtered = [u for u in images if isinstance(u, str) and "/original." in u]
    unique = []
    seen = set()
    for url in filtered:
        if url not in seen:
            seen.add(url)
            unique.append(url)
    return unique


def uz_is_incomplete(text: str) -> bool:
    t = norm(text)
    if len(t) < 12:
        return True
    if t.endswith(" so"):
        return True
    if t in {"Qo", "Ko", "Sayrga mo"}:
        return True
    return False


def main():
    data = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
    products = data.get("products", [])

    incomplete_uz = 0
    cleaned = []
    for p in products:
        name_ru = clean_name(p.get("name_ru", ""))
        desc_ru = clean_description(p.get("description_ru", ""))

        name_uz_raw = norm(p.get("name_uz", ""))
        desc_uz_raw = norm(p.get("description_uz", ""))
        name_uz = "" if uz_is_incomplete(name_uz_raw) else clean_name(name_uz_raw)
        desc_uz = "" if uz_is_incomplete(desc_uz_raw) else clean_description(desc_uz_raw)
        if not name_uz or not desc_uz:
            incomplete_uz += 1

        images = clean_images(p.get("images", []))
        main_image = p.get("mainImage") or (images[0] if images else "")
        if main_image and main_image not in images and "/original." in main_image:
            images = [main_image] + images

        cleaned.append(
            {
                "slug": p.get("slug", ""),
                "source_ru": p.get("source_ru", ""),
                "source_uz": p.get("source_uz", ""),
                "name_ru": name_ru,
                "name_uz": name_uz,
                "description_ru": desc_ru,
                "description_uz": desc_uz,
                "price": p.get("price", 0),
                "mainImage": main_image,
                "images": images,
                "imageCount": len(images),
            }
        )

    out = {
        "scrapedAt": data.get("scrapedAt"),
        "total": len(cleaned),
        "incompleteUzCount": incomplete_uz,
        "products": cleaned,
    }
    OUTPUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved cleaned file: {OUTPUT_PATH}")
    print(f"Products: {len(cleaned)} | incomplete UZ: {incomplete_uz}")


if __name__ == "__main__":
    main()
