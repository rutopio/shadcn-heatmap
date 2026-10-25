#!/usr/bin/env python3
"""Build social images from the captured demos and installed Fontsource fonts."""

from io import BytesIO
from pathlib import Path

from fontTools.ttLib import TTFont

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
PUBLIC = ROOT / "public"
FONTS = ROOT / "node_modules" / "@fontsource-variable"
TITLE_FONT = FONTS / "host-grotesk/files/host-grotesk-latin-wght-normal.woff2"
URL_FONT = FONTS / "albert-sans/files/albert-sans-latin-wght-normal.woff2"

OG_W, OG_H = 1200, 630
BG = (255, 255, 255)
FG = (9, 9, 11)  # zinc-950, matches --color-foreground
MUTED = (113, 113, 122)  # zinc-500, matches --color-muted-foreground
PADDING_X = 80  # min horizontal breathing room
TITLE = "shadcn-heatmap"
TITLE_SIZE = 72
TITLE_WEIGHT = 800  # Host Grotesk max weight (bold)
URL = "https://heatmap.chingru.com"
URL_SIZE = 28
URL_WEIGHT = 400  # regular
GAP = 36  # space between title and the example image
URL_GAP = 28  # space between the example image and the url line
IMG_MAX_W = OG_W - PADDING_X * 2  # 1040
IMG_MAX_H = 330  # cap so tall examples (date) don't dwarf short ones (status)

ROUTES = {
    "calendar": "calendar-heatmap.png",
    "weekday": "weekday-heatmap.png",
    "date": "date-heatmap.png",
    "status": "status-heatmap.png",
}


def load_font(path: Path, size: int, weight: int) -> ImageFont.FreeTypeFont:
    # FreeType builds do not all support WOFF2, so decode it in memory.
    source = TTFont(path)
    source.flavor = None
    buffer = BytesIO()
    source.save(buffer)
    buffer.seek(0)
    font = ImageFont.truetype(buffer, size)
    font.set_variation_by_axes([weight])
    return font


def fit(img: Image.Image, max_w: int, max_h: int) -> Image.Image:
    scale = min(max_w / img.width, max_h / img.height)
    if scale >= 1:
        return img
    return img.resize(
        (round(img.width * scale), round(img.height * scale)),
        Image.LANCZOS,
    )


def build(
    route: str,
    asset_name: str,
    title_font: ImageFont.FreeTypeFont,
    url_font: ImageFont.FreeTypeFont,
) -> Path:
    canvas = Image.new("RGB", (OG_W, OG_H), BG)
    draw = ImageDraw.Draw(canvas)

    t_bbox = draw.textbbox((0, 0), TITLE, font=title_font)
    title_w = t_bbox[2] - t_bbox[0]
    title_h = t_bbox[3] - t_bbox[1]

    u_bbox = draw.textbbox((0, 0), URL, font=url_font)
    url_w = u_bbox[2] - u_bbox[0]
    url_h = u_bbox[3] - u_bbox[1]

    # Example image, flattened onto white (PNGs have transparency).
    src = Image.open(ASSETS / asset_name).convert("RGBA")
    flat = Image.new("RGBA", src.size, BG + (255,))
    flat.alpha_composite(src)
    example = fit(flat.convert("RGB"), IMG_MAX_W, IMG_MAX_H)

    # Center the (title + image + url) group vertically.
    group_h = title_h + GAP + example.height + URL_GAP + url_h
    top = (OG_H - group_h) // 2

    # Title: account for the bbox offset so it's truly centered.
    title_x = (OG_W - title_w) // 2 - t_bbox[0]
    title_y = top - t_bbox[1]
    draw.text((title_x, title_y), TITLE, font=title_font, fill=FG)

    img_x = (OG_W - example.width) // 2
    img_y = top + title_h + GAP
    canvas.paste(example, (img_x, img_y))

    url_x = (OG_W - url_w) // 2 - u_bbox[0]
    url_y = img_y + example.height + URL_GAP - u_bbox[1]
    draw.text((url_x, url_y), URL, font=url_font, fill=MUTED)

    out = PUBLIC / f"og-{route}.png"
    canvas.save(out, "PNG", optimize=True)
    return out


def main() -> None:
    title_font = load_font(TITLE_FONT, TITLE_SIZE, TITLE_WEIGHT)
    url_font = load_font(URL_FONT, URL_SIZE, URL_WEIGHT)
    for route, asset_name in ROUTES.items():
        out = build(route, asset_name, title_font, url_font)
        size_kb = out.stat().st_size / 1024
        print(f"  {out.relative_to(ROOT)}  ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
