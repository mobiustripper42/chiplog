#!/usr/bin/env python3
"""Generate Chiplog PWA icons with zero dependencies (stdlib zlib only).

Draws a speedometer mark — a gauge ring with a swept accent arc and a needle —
on a solid dark background. Supersampled for clean edges. Regenerate with:

    python3 scripts/make-icons.py
"""
import math
import struct
import zlib
import os

BG     = (0x0b, 0x0d, 0x0e)   # app background
TRACK  = (0x2a, 0x30, 0x34)   # unfilled gauge track
ACCENT = (0x4e, 0xa3, 0xff)   # single accent
HUB    = (0xf2, 0xf4, 0xf5)   # needle hub / tip

ARC_START = -135.0            # clock degrees (0 = up, + = clockwise)
ARC_SWEEP = 270.0
VALUE_FRAC = 0.72             # how far the accent arc fills the track

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")


def clock_angle(dx, dy):
    """Degrees clockwise from straight up, range (-180, 180]."""
    return math.degrees(math.atan2(dx, -dy))


def in_arc(a, start, sweep):
    d = (a - start) % 360.0
    return 0.0 <= d <= sweep


def dist_to_segment(px, py, ax, ay, bx, by):
    vx, vy = bx - ax, by - ay
    wx, wy = px - ax, py - ay
    L2 = vx * vx + vy * vy
    t = 0.0 if L2 == 0 else max(0.0, min(1.0, (wx * vx + wy * vy) / L2))
    cx, cy = ax + t * vx, ay + t * vy
    return math.hypot(px - cx, py - cy)


def sample(x, y, n, mark_scale):
    """Return (r,g,b) for canvas coord (x,y) on an n-sized icon."""
    cx = cy = n / 2.0
    R = (n / 2.0) * mark_scale
    th = R * 0.17                 # ring thickness
    r_outer, r_inner = R, R - th
    needle_ang = ARC_START + VALUE_FRAC * ARC_SWEEP
    needle_len = R * 0.80
    nx = cx + needle_len * math.sin(math.radians(needle_ang))
    ny = cy - needle_len * math.cos(math.radians(needle_ang))
    needle_w = R * 0.065
    hub_r = R * 0.135

    dx, dy = x - cx, y - cy
    r = math.hypot(dx, dy)

    # Hub (drawn on top of everything)
    if r <= hub_r:
        return HUB
    # Needle
    if dist_to_segment(x, y, cx, cy, nx, ny) <= needle_w:
        return HUB
    # Gauge ring
    if r_inner <= r <= r_outer:
        a = clock_angle(dx, dy)
        if in_arc(a, ARC_START, ARC_SWEEP):
            return ACCENT if in_arc(a, ARC_START, VALUE_FRAC * ARC_SWEEP) else TRACK
    return BG


def render(n, mark_scale, ss=3):
    """Render an n×n RGB icon, supersampled by `ss`."""
    big = n * ss
    rows = []
    for y in range(n):
        row = bytearray()
        for x in range(n):
            r = g = b = 0
            for sy in range(ss):
                for sx in range(ss):
                    px = x * ss + sx + 0.5
                    py = y * ss + sy + 0.5
                    c = sample(px / ss, py / ss, n, mark_scale)
                    r += c[0]; g += c[1]; b += c[2]
            k = ss * ss
            row += bytes((r // k, g // k, b // k))
        rows.append(row)
    return rows


def write_png(path, rows):
    h = len(rows)
    w = len(rows[0]) // 3
    raw = bytearray()
    for row in rows:
        raw.append(0)           # filter type 0
        raw += row
    comp = zlib.compress(bytes(raw), 9)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff))

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)  # 8-bit RGB
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", comp))
        f.write(chunk(b"IEND", b""))


def main():
    os.makedirs(OUT, exist_ok=True)
    specs = [
        ("icon-512.png", 512, 0.84),
        ("icon-192.png", 192, 0.84),
        ("apple-touch-icon.png", 180, 0.82),
        ("icon-512-maskable.png", 512, 0.62),   # smaller mark → fits the safe zone
    ]
    for name, n, scale in specs:
        print(f"rendering {name} ({n}px)...")
        write_png(os.path.join(OUT, name), render(n, scale))
    print("done.")


if __name__ == "__main__":
    main()
