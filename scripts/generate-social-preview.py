#!/usr/bin/env python3
"""Generate assets/social-preview.png for the Web CTF Playbook repository."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social-preview.png"
WIDTH, HEIGHT = 1280, 640


def font(size: int, bold: bool = False):
    candidates = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def main():
    image = Image.new("RGB", (WIDTH, HEIGHT), "#06101d")
    draw = ImageDraw.Draw(image)
    start, end = (6, 16, 29), (22, 19, 43)
    for y in range(HEIGHT):
        draw.line((0, y, WIDTH, y), fill=lerp(start, end, y / HEIGHT))

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse((930, -110, 1290, 250), fill=(56, 189, 248, 28))
    od.ellipse((-110, 430, 330, 820), fill=(167, 139, 250, 28))
    image = Image.alpha_composite(image.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((72, 72, 1208, 568), radius=28, fill="#020617", outline="#1e293b", width=2)
    draw.rounded_rectangle((72, 72, 1208, 84), radius=6, fill="#38bdf8")

    draw.text((126, 136), "WEB CTF PLAYBOOK", font=font(24, True), fill="#38bdf8")
    draw.text((126, 196), "From entry point to exploit chain.", font=font(46, True), fill="#f8fafc")
    draw.text((126, 260), "Scenario-first routing, minimal validation, searchable references.", font=font(24), fill="#cbd5e1")

    pills = [
        ((126, 330, 314, 382), "#0f766e", "8 modules"),
        ((330, 330, 542, 382), "#1d4ed8", "33 chapters"),
        ((558, 330, 788, 382), "#7c3aed", "12 recipes"),
    ]
    for box, color, label in pills:
        draw.rounded_rectangle(box, radius=26, fill=color)
        bbox = draw.textbbox((0, 0), label, font=font(20, True))
        x = box[0] + (box[2] - box[0] - (bbox[2] - bbox[0])) / 2
        y = box[1] + (box[3] - box[1] - (bbox[3] - bbox[1])) / 2 - 3
        draw.text((x, y), label, font=font(20, True), fill="#f8fafc")

    draw.rounded_rectangle((126, 432, 996, 518), radius=16, fill="#0f172a", outline="#1e293b", width=2)
    for cx, color in [(154, "#fb7185"), (176, "#fbbf24"), (198, "#34d399")]:
        draw.ellipse((cx - 6, 450, cx + 6, 462), fill=color)
    draw.text((154, 478), "$ node scripts/search-notes.mjs gopher", font=font(20), fill="#e2e8f0")
    draw.rounded_rectangle((666, 500, 966, 504), radius=2, fill="#38bdf8")
    draw.text((930, 530), "CTF · lab · authorized testing only", font=font(18), fill="#94a3b8")

    image.convert("RGB").save(OUT, "PNG", optimize=True)
    print("wrote " + str(OUT))


if __name__ == "__main__":
    main()
