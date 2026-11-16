#!/usr/bin/env python3
"""Regenerates the PS logo assets (SVG logo, favicon, touch icon, wallpaper tiles)
from the pixel grid below. Run: python3 scripts/generate-logo-assets.py
k = black, w = platinum, b = periwinkle, g = green."""
import os, struct, zlib

GRID = """
kkwwwwwwwwwwwwwwwwkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
kkwwwwwwwwwwwwwwwwkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
kkwwwwwwwwwwwwwwwwwwkkkkkkkkkkkkkkkkkkkkkkkkkkkk
kkwwwwwwwwwwwwwwwwwwkkkkwwwwwwwwwwwwwwwwwwwwwwkk
wwwwwwwwwwwwwwwwwwwwwwkkwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwkkwwwwwwkkkkwwkkkkwwkkkkww
wwwwwwkkkkkkkkkwwwwwwwkkwwwwwwkkkkwwkkkkwwkggkww
wwwwwwkkkkkkkkkwwwwwwwkkwwwwwwkkkkwwkkkkwwkggkww
wwwwwwkkbbbbbbbkkwwwwwkkwwwwwwkkkkwwkkkkwwkkkkww
wwwwwwkkbbbbbbbkkwwwwwkkwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwkkbbbbbbbkkwwwwwkkwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwkkbbbbbbbkkwwwwwkkkkkkkkkkkkkkkkkkkkkkkkkk
wwwwwwkkbbbbbbbkkwwwwwkkkkkkkkkkkkkkkkkkkkkkkkkk
wwwwwwkkbbbbbbbkkwwwwwkkkkkkkkkkkkkkkkkkkkkkkkkk
wwwwwwkkkkkkkkkwwwwwwwkkkbbbbbbbbbbbbbbbbbbbbbbk
wwwwwwkkkkkkkkkwwwwwwwkkkbbbbbbbbbbbbbbbbbbbbbbk
wwwwwwwwwwwwwwwwwwwwwwkkkbbbbbbbbbbbbbbbbbbbbbbk
wwwwwwwwwwwwwwwwwwwwkkkkbbbbbbbbbbbbbbbbbbbbbbbk
wwwwwwwwwwwwwwwwwwwwkkbbbbbbbbbbbbbbbbbbbbbbbbbk
wwwwwwwwwwwwwwwwwwkkkkbbbbbbbbbbbbbbbbbbbbbbbbbk
wwwwwwwwwwwwwwwwwwkkbbbbbbbbbbbbbbbbbbbbbbbbbbbk
wwwwwkkkkkkkkkkkkkkkbbbbbbbbbbbbbbbbbbbbbbbbbbbk
wwwwwkkkkkkkkkkkkkbbbbbbbkkkkkkkkkkkkkkkkkbbbbbk
wwwwwkkkkkkkkkkkkkbbbbbkkkkkkkkkkkkkkkkkkkbbbbbk
wwwwwkkbbbbbbbbbbbbbbbbkkwwwwwwwwwwwwwwwkkbbbbbk
wwwwwkkbbbbbbbbbbbbbbkkkkwwwwwwwwwwwwwwwkkbbbbbk
wwwwwkkbbbbbbbbbbbbbbkkwwwwwwwwwwwwwwwwwkkbbbbbk
wwwwwkkbbbbbbbbbbbbbbkkwwwwkkkkkkkkkkkkkkkbbbbbk
wwwwwkkbbbbbbbbbbbbbbkkwwwwkkkkkkkkkbbbbbbbbbbbk
wwwwwkkbbbbbbbbbbbbbbkkwwwwkkkkkkkkkbbbbbbbbbbbk
wwwwwkkbbbbbbbbbbbbbbkkwwwwwwwwwwwwkkbbbbbbbbbbk
wwwwwkkbkkkkkkbbbbbbbkkwwwwwwwwwwwwkkkbbbkkkkkkk
wwwwwkkbkwwwkkbbbbbbbkkwwwwwwwwwwwwwkkbbbkwwwkkk
wwwwwkkbkwwwkkkkkkbbbbbkkkkkkkkkwwwwkkkkkkwwwkkk
wwwwwkkbkwwwkwwwwkbbbbbkkkkkkkkkwwwwwwwwwkwwwkkk
wwwwwkkbkwwwkwwwwkkbbbbbbbbbbkkkwwwwwwwwwkwwwkkk
wwwwwkkbkkkkkkkwwwwkkbbbbbbbbkkkwwwwkkkkkkkkkkkk
wwwwwkkbbbbbbbkwwwwkkkkkkkkkkkkkwwwwkkbbbbbbbbbk
wwwwwkkbbbbbbbkwwwwwwwwwwwwwwwwwwwwwkkbbbbbbbbbk
wwwwwkkbbbbbbbkkkwwwwwwwwwwwwwwwwwwkkkbbbbbbbbbk
wwwwwkkbbbbbbbbbkwwwwwwwwwwwwwwwwwwkbbbbbbbbbbbk
wwwwwkkbbbbbbbbbkkkkkkkkkkkkkkkkkkkkbbbbbbbbbbbk
wwwwwkkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk
wwwwwkkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbkkk
kkwwwkkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbkkk
""".split()

PAD = 2
COLORS = {"k": "#000000", "w": "#d6d6de", "b": "#6b74e0", "g": "#b4f000"}

def build():
    h, w = len(GRID), len(GRID[0])
    H, W = h + PAD * 2, w + PAD * 2
    g = [["k"] * W for _ in range(H)]
    for y in range(h):
        for x in range(w):
            g[y + PAD][x + PAD] = GRID[y][x]
    out = [row[:] for row in g]
    for y in range(H):
        for x in range(W):
            if g[y][x] != "k":
                continue
            near = any(
                g[j][i] != "k"
                for j in range(max(0, y - PAD), min(H, y + PAD + 1))
                for i in range(max(0, x - PAD), min(W, x + PAD + 1))
            )
            if not near:
                out[y][x] = "."
    return out

def runs(grid):
    for y, row in enumerate(grid):
        x = 0
        while x < len(row):
            c = row[x]; s = x
            while x < len(row) and row[x] == c:
                x += 1
            if c != ".":
                yield s, y, x - s, c

def svg(grid, colors, opacity=None, size=None, tile=None, offset=(0, 0)):
    H, W = len(grid), len(grid[0])
    vw, vh = (tile, tile) if tile else (W, H)
    dims = f' width="{size[0]}" height="{size[1]}"' if size else ""
    body = "".join(
        f'<rect x="{x + offset[0]}" y="{y + offset[1]}" width="{n}" height="1" fill="{colors[c]}"/>'
        for x, y, n, c in runs(grid) if colors.get(c)
    )
    op = f' opacity="{opacity}"' if opacity else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vw} {vh}"{dims} '
            f'shape-rendering="crispEdges"><g{op}>{body}</g></svg>\n')

def png(grid, scale, pad, bg):
    H, W = len(grid), len(grid[0])
    side = max(W, H) * scale + pad * 2
    ox, oy = (side - W * scale) // 2, (side - H * scale) // 2
    def rgb(hexv): return bytes(int(hexv[i:i + 2], 16) for i in (1, 3, 5))
    bgc = rgb(bg)
    raw = bytearray()
    for py in range(side):
        raw.append(0)
        for px in range(side):
            gx, gy = (px - ox) // scale, (py - oy) // scale
            c = grid[gy][gx] if 0 <= gx < W and 0 <= gy < H else "."
            raw += bgc if c == "." else rgb(COLORS[c])
    def chunk(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", side, side, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b""))

def main():
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    grid = build()
    H, W = len(grid), len(grid[0])
    def write(path, data, mode="w"):
        with open(os.path.join(root, path), mode) as f:
            f.write(data)
    write("public/ps-logo.svg", svg(grid, COLORS, size=(W, H)))
    write("app/icon.svg", svg(grid, COLORS, size=(W, H)))
    write("app/apple-icon.png", png(grid, 3, 12, "#d6d6de"), "wb")
    # Embossed, single-tone wallpaper tiles (logo sits in the middle of an empty square).
    tile = 128
    off = ((tile - W) // 2, (tile - H) // 2)
    desk = {"k": "#544c96", "w": "#857dc6", "b": "#7870ba", "g": "#857dc6"}
    mob = {"k": "#3d3288", "w": "#6257b4", "b": "#574ca8", "g": "#6257b4"}
    write("public/wallpaper-desktop.svg", svg(grid, desk, tile=tile, offset=off, size=(tile, tile)))
    write("public/wallpaper-mobile.svg", svg(grid, mob, tile=tile, offset=off, size=(tile, tile)))
    print("logo", W, "x", H)

main()
