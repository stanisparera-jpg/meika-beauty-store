"""
Generate bespoke studio vector packaging illustrations for MEIKA Beauty Store.
Strictly uses clean generic studio archetypes per product category/subcategory
plus authentic variant/shade tones without impersonating official brand trade dress.
"""
from __future__ import annotations

import html
import math
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public" / "images"


def ensure_dirs() -> None:
    for sub in ["hero", "categories", "products", "products/variants", "products/angles"]:
        (PUB / sub).mkdir(parents=True, exist_ok=True)


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def shade_color(h: str, factor: float) -> str:
    """factor > 1 lightens towards white; < 1 darkens towards charcoal."""
    r, g, b = hex_to_rgb(h)
    if factor >= 1.0:
        t = min(1.0, factor - 1.0)
        nr = int(r + (255 - r) * t)
        ng = int(g + (255 - g) * t)
        nb = int(b + (255 - b) * t)
    else:
        nr = int(max(0, r * factor))
        ng = int(max(0, g * factor))
        nb = int(max(0, b * factor))
    return f"#{nr:02x}{ng:02x}{nb:02x}"


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def svg_wrap(w: int, h: int, title: str, body: str, bg: str = "#FAF8F5", uid: str = "mk") -> str:
    if w == 600 and h == 600:
        out_w, out_h = 300, 300
    elif w == 720 and h == 620:
        out_w, out_h = 540, 465
    elif w == 640 and h == 540:
        out_w, out_h = 480, 405
    else:
        out_w, out_h = w, h
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{out_w}" height="{out_h}" viewBox="0 0 {w} {h}" role="img" aria-label="{esc(title)}">
  <defs>
    <radialGradient id="{uid}-studio-bg" cx="50%" cy="38%" r="68%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="#F2ECE6"/>
    </radialGradient>
    <radialGradient id="{uid}-shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#292626" stop-opacity="0.18"/>
      <stop offset="65%" stop-color="#292626" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#292626" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="{uid}-glass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.65"/>
      <stop offset="18%" stop-color="#FFFFFF" stop-opacity="0.12"/>
      <stop offset="82%" stop-color="#292626" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="{uid}-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3E3838"/>
      <stop offset="35%" stop-color="#5B5353"/>
      <stop offset="70%" stop-color="#292626"/>
      <stop offset="100%" stop-color="#494242"/>
    </linearGradient>
    <linearGradient id="{uid}-rose-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C98A94"/>
      <stop offset="35%" stop-color="#F1C7CD"/>
      <stop offset="75%" stop-color="#9A5F69"/>
      <stop offset="100%" stop-color="#D79CA6"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#{uid}-studio-bg)"/>
  <line x1="0" y1="{int(h * 0.78)}" x2="{w}" y2="{int(h * 0.78)}" stroke="#292626" stroke-opacity="0.06" stroke-width="1"/>
  {body}
</svg>
"""


def studio_label(sku: str, subtitle: str, x: int = 300, y: int = 556) -> str:
    return (
        f'<text x="{x}" y="{y}" text-anchor="middle" font-family="system-ui, sans-serif" '
        f'font-size="11" letter-spacing="1.8" fill="#5E5857">{esc(sku)}  |  {esc(subtitle.upper())}</text>'
    )


def draw_archetype(arch: str, sku: str, tone: str, accent: str, subtitle: str, uid: str, has_shades: bool) -> str:
    light = shade_color(tone, 1.32)
    dark = shade_color(tone, 0.76)
    mid = tone
    shadow = f'<ellipse cx="300" cy="472" rx="128" ry="22" fill="url(#{uid}-shadow)"/>'

    if arch == "foundation":
        # Square glass bottle + pump + liquid window
        body = f"""
        {shadow}
        <defs>
          <linearGradient id="{uid}-liq" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="{light}"/>
            <stop offset="52%" stop-color="{mid}"/>
            <stop offset="100%" stop-color="{dark}"/>
          </linearGradient>
        </defs>
        <rect x="266" y="106" width="68" height="30" rx="4" fill="url(#{uid}-metal)"/>
        <rect x="242" y="120" width="38" height="14" rx="5" fill="#292626"/>
        <rect x="260" y="134" width="80" height="58" rx="6" fill="url(#{uid}-metal)"/>
        <rect x="254" y="190" width="92" height="16" rx="3" fill="url(#{uid}-rose-metal)"/>
        <rect x="220" y="206" width="160" height="260" rx="18" fill="#FFFFFF" fill-opacity="0.65" stroke="#292626" stroke-opacity="0.16" stroke-width="1.5"/>
        <rect x="232" y="220" width="136" height="232" rx="11" fill="url(#{uid}-liq)"/>
        <rect x="220" y="206" width="160" height="260" rx="18" fill="url(#{uid}-glass)"/>
        <rect x="248" y="276" width="104" height="84" rx="6" fill="#FAF8F5" fill-opacity="0.92" stroke="#292626" stroke-opacity="0.12"/>
        <line x1="264" y1="304" x2="336" y2="304" stroke="#292626" stroke-width="1.5"/>
        <text x="300" y="328" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#292626">{sku}</text>
        <text x="300" y="346" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" letter-spacing="1.2" fill="#5E5857">STUDIO SHADE</text>
        {studio_label(sku, subtitle)}
        """
    elif arch == "cushion":
        # Open round compact showing cushion sponge + mirror lid
        body = f"""
        {shadow}
        <defs>
          <radialGradient id="{uid}-pan" cx="42%" cy="40%" r="60%">
            <stop offset="0%" stop-color="{light}"/>
            <stop offset="68%" stop-color="{mid}"/>
            <stop offset="100%" stop-color="{dark}"/>
          </radialGradient>
        </defs>
        <circle cx="300" cy="212" r="112" fill="#FAF8F5" stroke="url(#{uid}-rose-metal)" stroke-width="10"/>
        <circle cx="300" cy="212" r="96" fill="#EDE8E4"/>
        <path d="M 235 162 L 325 132 L 350 154 L 258 188 Z" fill="#FFFFFF" fill-opacity="0.68"/>
        <circle cx="300" cy="364" r="118" fill="#292626"/>
        <circle cx="300" cy="360" r="108" fill="#FAF8F5"/>
        <circle cx="300" cy="360" r="84" fill="url(#{uid}-pan)"/>
        <circle cx="300" cy="360" r="84" fill="#292626" fill-opacity="0.06" stroke="#292626" stroke-opacity="0.14"/>
        <circle cx="364" cy="402" r="46" fill="#FAF8F5" stroke="#E8A5AD" stroke-width="2"/>
        <rect x="342" y="396" width="44" height="10" rx="5" fill="#E8A5AD"/>
        {studio_label(sku, subtitle)}
        """
    elif arch == "concealer":
        body = f"""
        <ellipse cx="268" cy="472" rx="88" ry="18" fill="url(#{uid}-shadow)"/>
        <ellipse cx="384" cy="472" rx="48" ry="12" fill="url(#{uid}-shadow)"/>
        <rect x="234" y="130" width="68" height="66" rx="8" fill="url(#{uid}-metal)"/>
        <rect x="232" y="192" width="72" height="12" rx="3" fill="url(#{uid}-rose-metal)"/>
        <rect x="220" y="204" width="96" height="254" rx="14" fill="#FFFFFF" fill-opacity="0.7" stroke="#292626" stroke-opacity="0.18" stroke-width="1.5"/>
        <rect x="230" y="218" width="76" height="226" rx="9" fill="{mid}"/>
        <rect x="220" y="204" width="96" height="254" rx="14" fill="url(#{uid}-glass)"/>
        <rect x="242" y="294" width="52" height="68" rx="4" fill="#FAF8F5" fill-opacity="0.9"/>
        <text x="268" y="332" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#292626">{sku}</text>
        <line x1="364" y1="158" x2="394" y2="412" stroke="#5E5857" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="395" cy="422" rx="12" ry="18" fill="{light}" stroke="#292626" stroke-opacity="0.2" transform="rotate(-8 395 422)"/>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("loose_powder", "jar"):
        is_jar = arch == "jar"
        top_fill = "#FFFFFF" if is_jar else light
        body = f"""
        {shadow}
        <ellipse cx="300" cy="430" rx="126" ry="34" fill="#FAF8F5" stroke="#292626" stroke-opacity="0.18" stroke-width="1.5"/>
        <rect x="174" y="314" width="252" height="116" rx="14" fill="{top_fill}" stroke="#292626" stroke-opacity="0.16" stroke-width="1.5"/>
        <ellipse cx="300" cy="314" rx="126" ry="34" fill="{light}" stroke="#292626" stroke-opacity="0.15"/>
        <ellipse cx="300" cy="312" rx="102" ry="24" fill="{mid}"/>
        <path d="M 226 308 Q 280 288 336 306 Q 368 316 320 326 Q 260 330 226 308 Z" fill="#FFFFFF" fill-opacity="0.62"/>
        <ellipse cx="300" cy="182" rx="122" ry="30" fill="url(#{uid}-metal)" transform="rotate(-14 300 182)"/>
        <rect x="178" y="182" width="244" height="32" rx="10" fill="url(#{uid}-rose-metal)" transform="rotate(-14 300 182)"/>
        <rect x="242" y="358" width="116" height="44" rx="5" fill="#FFFFFF" fill-opacity="0.92" stroke="#292626" stroke-opacity="0.12"/>
        <text x="300" y="385" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#292626">{sku}</text>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("compact_powder", "blush", "contour"):
        body = f"""
        {shadow}
        <rect x="184" y="114" width="232" height="154" rx="22" fill="#292626"/>
        <rect x="198" y="128" width="204" height="126" rx="14" fill="#EFEAE5"/>
        <path d="M 218 144 L 310 144 L 254 242 L 212 242 Z" fill="#FFFFFF" fill-opacity="0.65"/>
        <rect x="176" y="274" width="248" height="184" rx="26" fill="#292626"/>
        <rect x="194" y="292" width="212" height="148" rx="16" fill="{light}" stroke="url(#{uid}-rose-metal)" stroke-width="3"/>
        <rect x="206" y="304" width="188" height="124" rx="10" fill="{mid}"/>
        <path d="M 206 304 Q 300 340 394 304 L 394 428 L 206 428 Z" fill="{dark}" fill-opacity="0.32"/>
        {studio_label(sku, subtitle)}
        """
    elif arch == "highlighter":
        body = f"""
        {shadow}
        <rect x="274" y="118" width="52" height="62" rx="6" fill="url(#{uid}-rose-metal)"/>
        <path d="M 244 190 L 356 190 L 376 446 C 376 458 364 466 350 466 L 250 466 C 236 466 224 458 224 446 Z" fill="#FFFFFF" fill-opacity="0.7" stroke="#292626" stroke-opacity="0.16" stroke-width="1.5"/>
        <path d="M 254 206 L 346 206 L 364 442 L 236 442 Z" fill="{light}"/>
        <circle cx="300" cy="322" r="46" fill="{mid}" fill-opacity="0.45"/>
        <path d="M 300 264 L 310 310 L 356 320 L 310 330 L 300 376 L 290 330 L 244 320 L 290 310 Z" fill="#FFFFFF" fill-opacity="0.88"/>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("setting_spray", "toner", "micellar", "bi_phase"):
        dual_line = '<line x1="232" y1="292" x2="368" y2="292" stroke="#E8A5AD" stroke-width="3" stroke-dasharray="6 4"/>' if arch == "bi_phase" else ""
        cap_h = 54 if arch == "setting_spray" else 42
        mist = (
            '<circle cx="204" cy="148" r="4" fill="#B87883" fill-opacity="0.45"/>'
            '<circle cx="182" cy="136" r="3" fill="#B87883" fill-opacity="0.35"/>'
            '<circle cx="194" cy="166" r="2.5" fill="#B87883" fill-opacity="0.35"/>'
            if arch == "setting_spray" else ""
        )
        body = f"""
        {shadow}
        {mist}
        <rect x="272" y="{178 - cap_h}" width="56" height="{cap_h}" rx="6" fill="url(#{uid}-metal)"/>
        <rect x="260" y="176" width="80" height="22" rx="4" fill="url(#{uid}-rose-metal)"/>
        <rect x="220" y="198" width="160" height="266" rx="28" fill="#FFFFFF" fill-opacity="0.72" stroke="#292626" stroke-opacity="0.16" stroke-width="1.5"/>
        <rect x="232" y="238" width="136" height="214" rx="20" fill="{light}" fill-opacity="0.72"/>
        <rect x="232" y="292" width="136" height="160" rx="18" fill="{mid}" fill-opacity="0.55"/>
        {dual_line}
        <rect x="220" y="198" width="160" height="266" rx="28" fill="url(#{uid}-glass)"/>
        <rect x="246" y="294" width="108" height="92" rx="6" fill="#FAF8F5" fill-opacity="0.94" stroke="#292626" stroke-opacity="0.12"/>
        <text x="300" y="336" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#292626">{sku}</text>
        <text x="300" y="356" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" letter-spacing="1.2" fill="#5E5857">SKINCARE FORMULA</text>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("lip_cream", "lip_tint", "lip_gloss"):
        gloss_bar = '<rect x="236" y="218" width="12" height="212" rx="6" fill="#FFFFFF" fill-opacity="0.58"/>' if arch in ("lip_gloss", "lip_tint") else ""
        cap_fill = f"url(#{uid}-rose-metal)" if arch == "lip_gloss" else f"url(#{uid}-metal)"
        body = f"""
        <ellipse cx="264" cy="472" rx="64" ry="16" fill="url(#{uid}-shadow)"/>
        <ellipse cx="372" cy="472" rx="34" ry="11" fill="url(#{uid}-shadow)"/>
        <rect x="232" y="122" width="64" height="72" rx="7" fill="{cap_fill}"/>
        <rect x="224" y="194" width="80" height="266" rx="12" fill="#FFFFFF" fill-opacity="0.6" stroke="#292626" stroke-opacity="0.18" stroke-width="1.5"/>
        <rect x="232" y="206" width="64" height="242" rx="8" fill="{mid}"/>
        {gloss_bar}
        <rect x="224" y="194" width="80" height="266" rx="12" fill="url(#{uid}-glass)"/>
        <rect x="242" y="294" width="44" height="70" rx="4" fill="#FAF8F5" fill-opacity="0.92"/>
        <text x="264" y="334" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#292626">{sku}</text>
        <rect x="356" y="138" width="32" height="62" rx="6" fill="{cap_fill}"/>
        <line x1="372" y1="200" x2="372" y2="410" stroke="#5E5857" stroke-width="5"/>
        <path d="M 364 410 L 380 410 L 376 446 C 374 452 370 452 368 446 Z" fill="{dark}"/>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("lipstick", "lip_balm"):
        bullet = (
            f'<path d="M 274 226 L 274 148 C 274 134 326 110 326 138 L 326 226 Z" fill="{mid}"/>'
            f'<path d="M 284 148 L 314 132 L 314 218 L 284 218 Z" fill="{light}" fill-opacity="0.35"/>'
            if arch == "lipstick"
            else f'<path d="M 272 226 L 272 166 C 272 132 328 132 328 166 L 328 226 Z" fill="{mid}"/>'
        )
        body = f"""
        {shadow}
        {bullet}
        <rect x="264" y="224" width="72" height="62" rx="4" fill="url(#{uid}-rose-metal)"/>
        <rect x="252" y="286" width="96" height="174" rx="10" fill="url(#{uid}-metal)"/>
        <rect x="268" y="330" width="64" height="58" rx="4" fill="#FAF8F5" fill-opacity="0.94"/>
        <text x="300" y="364" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#292626">{sku}</text>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("mascara", "brow_gel"):
        bh = 250 if arch == "mascara" else 210
        body = f"""
        <ellipse cx="258" cy="472" rx="54" ry="14" fill="url(#{uid}-shadow)"/>
        <ellipse cx="366" cy="472" rx="40" ry="11" fill="url(#{uid}-shadow)"/>
        <rect x="228" y="140" width="60" height="72" rx="8" fill="url(#{uid}-rose-metal)"/>
        <rect x="220" y="210" width="76" height="{bh}" rx="16" fill="url(#{uid}-metal)"/>
        <rect x="234" y="294" width="48" height="62" rx="4" fill="#FAF8F5" fill-opacity="0.94"/>
        <text x="258" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#292626">{sku}</text>
        <rect x="348" y="138" width="36" height="66" rx="6" fill="url(#{uid}-metal)"/>
        <line x1="366" y1="204" x2="366" y2="372" stroke="#5E5857" stroke-width="5"/>
        <rect x="355" y="372" width="22" height="74" rx="10" fill="{mid}"/>
        <line x1="350" y1="384" x2="382" y2="384" stroke="#292626" stroke-width="2"/>
        <line x1="348" y1="398" x2="384" y2="398" stroke="#292626" stroke-width="2"/>
        <line x1="348" y1="412" x2="384" y2="412" stroke="#292626" stroke-width="2"/>
        <line x1="350" y1="426" x2="382" y2="426" stroke="#292626" stroke-width="2"/>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("eyeliner", "brow_pencil"):
        is_pencil = arch == "brow_pencil"
        spoolie = (
            '<line x1="366" y1="126" x2="366" y2="178" stroke="#5E5857" stroke-width="4"/>'
            '<rect x="358" y="122" width="16" height="36" rx="6" fill="#292626"/>'
            if is_pencil
            else '<path d="M 358 176 L 374 176 L 366 130 Z" fill="#292626"/>'
        )
        body = f"""
        <ellipse cx="300" cy="472" rx="112" ry="16" fill="url(#{uid}-shadow)"/>
        <rect x="276" y="182" width="26" height="270" rx="6" fill="url(#{uid}-metal)" transform="rotate(-12 300 320)"/>
        <rect x="350" y="176" width="32" height="276" rx="6" fill="#FAF8F5" stroke="#292626" stroke-width="1.5"/>
        <rect x="350" y="218" width="32" height="40" fill="{mid}"/>
        {spoolie}
        <path d="M 176 410 Q 240 368 292 406 T 420 398" fill="none" stroke="{mid}" stroke-width="5" stroke-linecap="round"/>
        <text x="300" y="492" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#292626">{sku} STUDIO PEN</text>
        {studio_label(sku, subtitle)}
        """
    elif arch == "eyeshadow":
        pans = ""
        palette_hex = ["#F1DDD2", "#D9A99A", mid, "#8E575E", "#C6906B", dark]
        for idx, ph in enumerate(palette_hex):
            col = idx % 3
            row = idx // 3
            px = 188 + col * 78
            py = 312 + row * 68
            pans += f'<rect x="{px}" y="{py}" width="66" height="54" rx="6" fill="{ph}" stroke="#292626" stroke-opacity="0.14"/>'
        body = f"""
        {shadow}
        <rect x="164" y="116" width="272" height="156" rx="14" fill="#292626"/>
        <rect x="178" y="130" width="244" height="128" rx="8" fill="#EFEBE7"/>
        <path d="M 196 140 L 288 140 L 234 248 L 188 248 Z" fill="#FFFFFF" fill-opacity="0.72"/>
        <rect x="164" y="286" width="272" height="170" rx="14" fill="#292626"/>
        <rect x="176" y="298" width="248" height="146" rx="10" fill="#FAF8F5"/>
        {pans}
        {studio_label(sku, subtitle)}
        """
    elif arch == "serum":
        body = f"""
        {shadow}
        <rect x="284" y="106" width="32" height="46" rx="14" fill="url(#{uid}-metal)"/>
        <rect x="268" y="148" width="64" height="28" rx="5" fill="url(#{uid}-rose-metal)"/>
        <path d="M 224 226 C 224 196 254 176 268 176 L 332 176 C 346 176 376 196 376 226 L 376 446 C 376 460 364 468 350 468 L 250 468 C 236 468 224 460 224 446 Z" fill="#FFFFFF" fill-opacity="0.78" stroke="#292626" stroke-opacity="0.16" stroke-width="1.5"/>
        <rect x="234" y="236" width="132" height="218" rx="16" fill="{light}"/>
        <rect x="234" y="310" width="132" height="144" rx="16" fill="{mid}" fill-opacity="0.5"/>
        <rect x="224" y="200" width="152" height="268" rx="22" fill="url(#{uid}-glass)"/>
        <rect x="248" y="290" width="104" height="92" rx="6" fill="#FAF8F5" fill-opacity="0.94" stroke="#292626" stroke-opacity="0.12"/>
        <text x="300" y="332" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#292626">{sku}</text>
        <text x="300" y="352" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" letter-spacing="1.2" fill="#5E5857">ACTIVE SERUM</text>
        {studio_label(sku, subtitle)}
        """
    elif arch in ("cleanser_tube", "sunscreen"):
        body = f"""
        {shadow}
        <rect x="262" y="410" width="76" height="54" rx="6" fill="url(#{uid}-metal)"/>
        <path d="M 212 132 L 388 132 L 352 410 L 248 410 Z" fill="{light}" stroke="#292626" stroke-opacity="0.18" stroke-width="1.5"/>
        <rect x="212" y="132" width="176" height="18" rx="3" fill="#FAF8F5" stroke="#292626" stroke-opacity="0.16"/>
        <path d="M 228 214 L 372 214 L 358 342 L 242 342 Z" fill="#FFFFFF" fill-opacity="0.9"/>
        <rect x="274" y="234" width="52" height="12" rx="6" fill="{accent}"/>
        <text x="300" y="282" text-anchor="middle" font-family="Georgia, serif" font-size="19" fill="#292626">{sku}</text>
        <text x="300" y="306" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" letter-spacing="1.2" fill="#5E5857">{subtitle.upper()}</text>
        {studio_label(sku, subtitle)}
        """
    elif arch == "brushes":
        body = f"""
        {shadow}
        <g transform="rotate(-14 236 320)">
          <rect x="224" y="238" width="24" height="214" rx="8" fill="url(#{uid}-metal)"/>
          <rect x="222" y="198" width="28" height="44" rx="3" fill="url(#{uid}-rose-metal)"/>
          <path d="M 206 198 C 202 126 270 126 266 198 Z" fill="{mid}"/>
        </g>
        <g>
          <rect x="286" y="220" width="28" height="240" rx="9" fill="url(#{uid}-metal)"/>
          <rect x="284" y="176" width="32" height="48" rx="3" fill="url(#{uid}-rose-metal)"/>
          <path d="M 262 176 C 254 96 346 96 338 176 Z" fill="{dark}"/>
        </g>
        <g transform="rotate(14 366 320)">
          <rect x="356" y="248" width="20" height="202" rx="7" fill="url(#{uid}-metal)"/>
          <rect x="354" y="212" width="24" height="38" rx="3" fill="url(#{uid}-rose-metal)"/>
          <path d="M 342 212 C 340 156 392 156 390 212 Z" fill="{light}"/>
        </g>
        {studio_label(sku, subtitle)}
        """
    elif arch == "sponge":
        body = f"""
        {shadow}
        <defs>
          <radialGradient id="{uid}-spg" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stop-color="{light}"/>
            <stop offset="60%" stop-color="{mid}"/>
            <stop offset="100%" stop-color="{dark}"/>
          </radialGradient>
        </defs>
        <path d="M 300 132 C 334 218 416 286 416 376 C 416 436 364 468 300 468 C 236 468 184 436 184 376 C 184 286 266 218 300 132 Z" fill="url(#{uid}-spg)" stroke="#292626" stroke-opacity="0.1"/>
        <ellipse cx="268" cy="290" rx="22" ry="44" fill="#FFFFFF" fill-opacity="0.18" transform="rotate(18 268 290)"/>
        {studio_label(sku, subtitle)}
        """
    elif arch == "curler":
        body = f"""
        {shadow}
        <path d="M 218 190 Q 300 154 382 190" fill="none" stroke="url(#{uid}-metal)" stroke-width="14" stroke-linecap="round"/>
        <path d="M 224 222 Q 300 190 376 222" fill="none" stroke="#E8A5AD" stroke-width="9" stroke-linecap="round"/>
        <line x1="252" y1="192" x2="252" y2="338" stroke="#5E5857" stroke-width="8"/>
        <line x1="348" y1="192" x2="348" y2="338" stroke="#5E5857" stroke-width="8"/>
        <line x1="264" y1="224" x2="288" y2="356" stroke="#292626" stroke-width="7"/>
        <line x1="336" y1="224" x2="312" y2="356" stroke="#292626" stroke-width="7"/>
        <circle cx="242" cy="408" r="42" fill="none" stroke="url(#{uid}-rose-metal)" stroke-width="12"/>
        <circle cx="358" cy="408" r="42" fill="none" stroke="url(#{uid}-rose-metal)" stroke-width="12"/>
        {studio_label(sku, subtitle)}
        """
    else:
        body = f"{shadow}<rect x='220' y='180' width='160' height='260' rx='18' fill='{mid}'/>{studio_label(sku, subtitle)}"

    return svg_wrap(600, 600, f"Ilustrasi produk {sku} {subtitle}", body, uid=uid)


PRODUCTS: list[dict[str, Any]] = [
    {"id": "mk-01", "sku": "MK-01", "arch": "foundation", "sub": "Foundation", "hasShades": True,
     "variants": [("v1", "115 Ivory", "#F0D5C2"), ("v2", "128 Warm Nude", "#E3BA9C"), ("v3", "220 Natural Beige", "#D5A07D"), ("v4", "310 Sun Beige", "#BA7E5C")]},
    {"id": "mk-02", "sku": "MK-02", "arch": "cushion", "sub": "Cushion", "hasShades": True,
     "variants": [("v1", "01 Vanilla", "#F4DFCF"), ("v2", "02 Ivory", "#EAD0BA"), ("v3", "03 Petal", "#DEC0AC"), ("v4", "04 Beige", "#CFA484")]},
    {"id": "mk-03", "sku": "MK-03", "arch": "concealer", "sub": "Concealer", "hasShades": True,
     "variants": [("v1", "01 Light", "#F5E2D4"), ("v2", "02 Neutral", "#E5C1A5"), ("v3", "03 Medium", "#CFA07E")]},
    {"id": "mk-04", "sku": "MK-04", "arch": "loose_powder", "sub": "Loose Powder", "hasShades": True,
     "variants": [("v1", "01 Light Beige", "#F3DEC9"), ("v2", "02 Natural", "#E7CBB0"), ("v3", "03 Warm Sand", "#D6AF8D")]},
    {"id": "mk-05", "sku": "MK-05", "arch": "compact_powder", "sub": "Compact Powder", "hasShades": True,
     "variants": [("v1", "22N Light Ivory", "#F0D7C5"), ("v2", "32N Neutral Beige", "#E0BFA4"), ("v3", "43W Golden Sand", "#CA9B78")]},
    {"id": "mk-06", "sku": "MK-06", "arch": "blush", "sub": "Blush On", "hasShades": True,
     "variants": [("v1", "01 Rosewood", "#D98A95"), ("v2", "02 Soft Peach", "#EBAA95"), ("v3", "03 Coral Bloom", "#DF7E7A")]},
    {"id": "mk-07", "sku": "MK-07", "arch": "contour", "sub": "Contour", "hasShades": True,
     "variants": [("v1", "01 Cool Latte", "#B99177"), ("v2", "02 Warm Cocoa", "#986B51"), ("v3", "03 Espresso Bronze", "#7A523B")]},
    {"id": "mk-08", "sku": "MK-08", "arch": "highlighter", "sub": "Highlighter", "hasShades": True,
     "variants": [("v1", "01 Champagne", "#F2DEC8"), ("v2", "02 Rose Pearl", "#ECC8CD"), ("v3", "03 Golden Glow", "#E7C59C")]},
    {"id": "mk-09", "sku": "MK-09", "arch": "setting_spray", "sub": "Setting Spray", "hasShades": False,
     "variants": [("v1", "55ml Travel Mist", "#EFE3E4"), ("v2", "100ml Regular Mist", "#EAD9DC")]},
    {"id": "mk-10", "sku": "MK-10", "arch": "loose_powder", "sub": "Loose Powder", "hasShades": True,
     "variants": [("v1", "01 Translucent", "#F7EDE6"), ("v2", "02 Natural", "#E6C7AC"), ("v3", "03 Cream", "#DDBB9C")]},

    {"id": "mk-11", "sku": "MK-11", "arch": "lip_cream", "sub": "Lip Cream", "hasShades": True,
     "variants": [("v1", "01 Kiss", "#B3565D"), ("v2", "04 Chic", "#8F3D45"), ("v3", "07 Spark", "#C86762"), ("v4", "11 Brick", "#9C4A42")]},
    {"id": "mk-12", "sku": "MK-12", "arch": "lipstick", "sub": "Lipstick", "hasShades": True,
     "variants": [("v1", "199 More Ruby", "#9E2A3B"), ("v2", "299 More Scarlet", "#BD3B42"), ("v3", "799 More Taupe", "#B27A76")]},
    {"id": "mk-13", "sku": "MK-13", "arch": "lip_tint", "sub": "Lip Tint", "hasShades": True,
     "variants": [("v1", "01 Vampire Blood", "#9A2333"), ("v2", "02 Cherry Bomb", "#BF3A4D"), ("v3", "04 Red Wine", "#832539")]},
    {"id": "mk-14", "sku": "MK-14", "arch": "lip_cream", "sub": "Lip Cream", "hasShades": True,
     "variants": [("v1", "01 Caramel Nude", "#BE7A6A"), ("v2", "03 Dazzle Rose", "#C46D7C"), ("v3", "06 Ruby Glass", "#A23A4C")]},
    {"id": "mk-15", "sku": "MK-15", "arch": "lip_gloss", "sub": "Lip Gloss", "hasShades": True,
     "variants": [("v1", "01 Dawn", "#E2A6AD"), ("v2", "02 Mist", "#D58997"), ("v3", "04 Berry", "#B55D71")]},
    {"id": "mk-16", "sku": "MK-16", "arch": "lip_balm", "sub": "Lip Balm", "hasShades": True,
     "variants": [("v1", "01 Petal Pink", "#E9A7B2"), ("v2", "02 Honey Peach", "#E8AA96"), ("v3", "03 Soft Cherry", "#CA707D")]},

    {"id": "mk-17", "sku": "MK-17", "arch": "mascara", "sub": "Mascara", "hasShades": True,
     "variants": [("v1", "Very Black", "#232020"), ("v2", "True Brown", "#573E35")]},
    {"id": "mk-18", "sku": "MK-18", "arch": "eyeliner", "sub": "Eyeliner", "hasShades": True,
     "variants": [("v1", "Jet Black", "#1F1D1D"), ("v2", "Dark Brown", "#564037")]},
    {"id": "mk-19", "sku": "MK-19", "arch": "eyeshadow", "sub": "Eyeshadow", "hasShades": True,
     "variants": [("v1", "01 Uptown Bae", "#B57977"), ("v2", "02 Hall of Stars", "#B88C74"), ("v3", "03 Royal Rose", "#9D636D")]},
    {"id": "mk-20", "sku": "MK-20", "arch": "brow_pencil", "sub": "Eyebrow Pencil", "hasShades": True,
     "variants": [("v1", "Dark Brown", "#594137"), ("v2", "Grey Brown", "#645C58"), ("v3", "Black", "#292626")]},
    {"id": "mk-21", "sku": "MK-21", "arch": "brow_gel", "sub": "Eyebrow Gel", "hasShades": True,
     "variants": [("v1", "01 Clear Lock", "#DCD6D2"), ("v2", "02 Espresso", "#574038"), ("v3", "03 Ash Brown", "#766A63")]},

    {"id": "mk-22", "sku": "MK-22", "arch": "cleanser_tube", "sub": "Facial Wash", "hasShades": False,
     "variants": [("v1", "100ml Tube", "#F3E6EA"), ("v2", "60ml Travel", "#EFE2E5")]},
    {"id": "mk-23", "sku": "MK-23", "arch": "toner", "sub": "Toner", "hasShades": False,
     "variants": [("v1", "80ml Bottle", "#E6EDF0"), ("v2", "150ml Regular", "#DAE5E9")]},
    {"id": "mk-24", "sku": "MK-24", "arch": "serum", "sub": "Serum", "hasShades": False,
     "variants": [("v1", "20ml Dropper", "#F0DCD7"), ("v2", "40ml Jumbo", "#E7CCCA")]},
    {"id": "mk-25", "sku": "MK-25", "arch": "jar", "sub": "Moisturizer", "hasShades": False,
     "variants": [("v1", "30g Jar", "#E2ECEF"), ("v2", "80g Value Jar", "#D4E3E8")]},
    {"id": "mk-26", "sku": "MK-26", "arch": "sunscreen", "sub": "Sunscreen", "hasShades": False,
     "variants": [("v1", "50g Tube", "#F7E7C8"), ("v2", "30g Travel Tube", "#F2DDBB")]},
    {"id": "mk-27", "sku": "MK-27", "arch": "micellar", "sub": "Micellar Water", "hasShades": False,
     "variants": [("v1", "100ml Bottle", "#F4DEE3"), ("v2", "240ml Bottle", "#EED3DA")]},
    {"id": "mk-28", "sku": "MK-28", "arch": "jar", "sub": "Moisturizer", "hasShades": False,
     "variants": [("v1", "50ml Gel Jar", "#E5EEE8"), ("v2", "100ml Gel Jar", "#D6E5DB")]},

    {"id": "mk-29", "sku": "MK-29", "arch": "brushes", "sub": "Makeup Brush", "hasShades": False,
     "variants": [("v1", "4-Piece Precision Set", "#D9A9B0"), ("v2", "Travel Trio Set", "#C7929B")]},
    {"id": "mk-30", "sku": "MK-30", "arch": "sponge", "sub": "Beauty Blender", "hasShades": False,
     "variants": [("v1", "Single Teardrop", "#E59AA5"), ("v2", "Duo Pouch Pack", "#D88290")]},
    {"id": "mk-31", "sku": "MK-31", "arch": "bi_phase", "sub": "Makeup Remover", "hasShades": False,
     "variants": [("v1", "150ml Bottle", "#DCE8F0"), ("v2", "70ml Travel", "#CFE0EB")]},
    {"id": "mk-32", "sku": "MK-32", "arch": "curler", "sub": "Eyelash Curler", "hasShades": False,
     "variants": [("v1", "Rose Steel + 2 Refill Pads", "#D79BA5")]},
]


def draw_swatch_angle(p: dict[str, Any]) -> str:
    sku = p["sku"]
    uid = f"{p['id']}-sw"
    if p["hasShades"]:
        strokes = ""
        n = len(p["variants"])
        start_y = 210 - (n - 2) * 32
        for idx, (_vid, vlabel, vhex) in enumerate(p["variants"]):
            y = start_y + idx * 72
            strokes += (
                f'<rect x="118" y="{y}" width="210" height="44" rx="22" fill="{vhex}" stroke="#292626" stroke-opacity="0.1"/>'
                f'<path d="M 134 {y + 12} Q 210 {y + 6} 310 {y + 14}" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round"/>'
                f'<text x="352" y="{y + 27}" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="#292626">{esc(vlabel)}</text>'
            )
        body = f"""
        <rect x="64" y="96" width="472" height="398" rx="18" fill="#FFFFFF" stroke="#292626" stroke-opacity="0.1"/>
        <text x="118" y="142" font-family="system-ui, sans-serif" font-size="12" letter-spacing="1.6" fill="#5E5857">SWATCH FORMULA  |  {sku}</text>
        {strokes}
        {studio_label(sku, "SIMULASI SHADE & TEKSTUR")}
        """
    else:
        _, vlabel, vhex = p["variants"][0]
        light = shade_color(vhex, 1.15)
        body = f"""
        <rect x="64" y="96" width="472" height="398" rx="18" fill="#FFFFFF" stroke="#292626" stroke-opacity="0.1"/>
        <text x="300" y="146" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" letter-spacing="1.6" fill="#5E5857">TEKSTUR / KOMPONEN PRODUK  |  {sku}</text>
        <circle cx="300" cy="306" r="108" fill="{light}" stroke="#292626" stroke-opacity="0.08"/>
        <path d="M 228 312 C 254 252 346 252 372 312 C 350 358 250 358 228 312 Z" fill="{vhex}" stroke="#292626" stroke-opacity="0.1"/>
        <path d="M 256 290 Q 300 270 344 290" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="6" stroke-linecap="round"/>
        <text x="300" y="446" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#292626">Varian Utama: {esc(vlabel)} (Non-Shade)</text>
        {studio_label(sku, p["sub"])}
        """
    return svg_wrap(600, 600, f"Tekstur dan varian {sku}", body, uid=uid)


def draw_detail_angle(p: dict[str, Any]) -> str:
    sku = p["sku"]
    uid = f"{p['id']}-dt"
    first_label = p["variants"][0][1]
    body = f"""
    <rect x="78" y="88" width="444" height="416" rx="18" fill="#FFFFFF" stroke="#292626" stroke-opacity="0.12"/>
    <text x="114" y="138" font-family="system-ui, sans-serif" font-size="12" letter-spacing="1.6" fill="#7A3D49">SPESIFIKASI ILUSTRASI KATALOG</text>
    <text x="114" y="176" font-family="Georgia, serif" font-size="28" fill="#292626">{esc(p['sub'])} ({esc(sku)})</text>
    <line x1="114" y1="202" x2="486" y2="202" stroke="#292626" stroke-opacity="0.12"/>
    <text x="114" y="244" font-family="system-ui, sans-serif" font-size="14" fill="#5E5857">Tipe Pemilih Varian</text>
    <text x="114" y="268" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#292626">{esc('Pemilih Shade Warna (' + str(len(p['variants'])) + ' Pilihan)' if p['hasShades'] else 'Ukuran / Paket Non-Shade (' + first_label + ')')}</text>
    <text x="114" y="316" font-family="system-ui, sans-serif" font-size="14" fill="#5E5857">Format Visual Studio</text>
    <text x="114" y="340" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#292626">Ilustrasi Kemasan Vektor Presisi (Non-Official Brand Asset)</text>
    <rect x="114" y="378" width="372" height="84" rx="10" fill="#F6E8E9"/>
    <text x="134" y="410" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#292626">Catatan Prototype Digital Entrepreneurship</text>
    <text x="134" y="434" font-family="system-ui, sans-serif" font-size="12" fill="#5E5857">Bukan kemasan resmi pihak ketiga; data demo untuk simulasi uji alur.</text>
    {studio_label(sku, p['sub'])}
    """
    return svg_wrap(600, 600, f"Ringkasan ilustrasi produk {sku}", body, uid=uid)


def generate_hero_and_categories() -> None:
    # Hero editorial still life
    hero_body = """
    <rect x="44" y="468" width="632" height="96" rx="16" fill="#FFFFFF" stroke="#292626" stroke-opacity="0.1"/>
    <ellipse cx="220" cy="466" rx="92" ry="18" fill="url(#hero-shadow)"/>
    <ellipse cx="388" cy="472" rx="84" ry="16" fill="url(#hero-shadow)"/>
    <ellipse cx="540" cy="468" rx="68" ry="14" fill="url(#hero-shadow)"/>
    <!-- Plinth & Foundation Bottle -->
    <rect x="172" y="138" width="46" height="44" rx="6" fill="url(#hero-metal)"/>
    <rect x="142" y="182" width="106" height="278" rx="18" fill="#FFFFFF" fill-opacity="0.82" stroke="#292626" stroke-opacity="0.14" stroke-width="1.5"/>
    <rect x="152" y="198" width="86" height="250" rx="12" fill="#E3BA9C"/>
    <rect x="166" y="276" width="58" height="72" rx="5" fill="#FAF8F5"/>
    <text x="195" y="318" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#292626">MEIKA</text>
    <!-- Cushion Compact -->
    <circle cx="388" cy="342" r="94" fill="#E8A5AD" stroke="#292626" stroke-opacity="0.12" stroke-width="2"/>
    <circle cx="388" cy="342" r="72" fill="#EAD0BA"/>
    <circle cx="436" cy="382" r="34" fill="#FAF8F5" stroke="#B87883" stroke-width="1.5"/>
    <!-- Velvet Lip Tube + Serum Dropper -->
    <rect x="512" y="186" width="54" height="58" rx="6" fill="url(#hero-rose-metal)"/>
    <rect x="506" y="244" width="66" height="218" rx="10" fill="#FFFFFF" fill-opacity="0.85" stroke="#292626" stroke-opacity="0.15"/>
    <rect x="514" y="254" width="50" height="198" rx="7" fill="#9E3F4B"/>
    <text x="360" y="520" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" letter-spacing="2" fill="#5E5857">FACE MAKEUP   •   LIP COLOR   •   SKINCARE   •   BEAUTY ESSENTIALS</text>
    """
    (PUB / "hero" / "hero-beauty-studio.svg").write_text(
        svg_wrap(720, 620, "Kurasi editorial produk kecantikan MEIKA Beauty Store", hero_body, bg="#F6E8E9", uid="hero"),
        encoding="utf-8",
    )

    atelier_body = """
    <rect x="56" y="72" width="528" height="396" rx="18" fill="#FFFFFF" stroke="#292626" stroke-opacity="0.1"/>
    <circle cx="240" cy="272" r="126" fill="#F6E8E9"/>
    <circle cx="412" cy="240" r="88" fill="#FAF8F5" stroke="#E8A5AD" stroke-width="2"/>
    <rect x="192" y="186" width="96" height="192" rx="16" fill="#292626"/>
    <rect x="208" y="226" width="64" height="72" rx="6" fill="#FAF8F5"/>
    <text x="240" y="265" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" letter-spacing="1.2" font-weight="600" fill="#292626">CURATED</text>
    <rect x="372" y="156" width="44" height="34" rx="12" fill="#7A3D49"/>
    <rect x="354" y="190" width="80" height="156" rx="18" fill="#E8C6CC" stroke="#292626" stroke-opacity="0.14"/>
    <rect x="366" y="236" width="56" height="58" rx="5" fill="#FFFFFF"/>
    <path d="M 394 316 C 414 352 448 378 448 416 C 448 442 424 456 394 456 C 364 456 340 442 340 416 C 340 378 374 352 394 316 Z" fill="#D88290"/>
    <text x="320" y="438" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" letter-spacing="1.6" fill="#5E5857">MEIKA CURATION STUDIO</text>
    """
    (PUB / "hero" / "brand-atelier.svg").write_text(
        svg_wrap(640, 540, "Atelier kurasi multi-brand MEIKA", atelier_body, bg="#FAF8F5", uid="atelier"),
        encoding="utf-8",
    )

    cats = [
        ("cat-face.svg", "foundation", "CAT-F", "#E3BA9C", "#E8A5AD", "Face Makeup"),
        ("cat-lip.svg", "lip_cream", "CAT-L", "#A6444E", "#E8A5AD", "Lip Makeup"),
        ("cat-eye.svg", "eyeshadow", "CAT-E", "#B57977", "#7A3D49", "Eye Makeup"),
        ("cat-skincare.svg", "serum", "CAT-S", "#D8E5E8", "#7A3D49", "Skincare"),
        ("cat-essentials.svg", "sponge", "CAT-B", "#E59AA5", "#7A3D49", "Beauty Essentials"),
    ]
    for fn, arch, code, tone, acc, sub in cats:
        svg_str = draw_archetype(arch, code, tone, acc, sub, f"cat-{code.lower()}", arch != "serum" and arch != "sponge")
        (PUB / "categories" / fn).write_text(svg_str, encoding="utf-8")


def main() -> None:
    ensure_dirs()
    generate_hero_and_categories()
    for p in PRODUCTS:
        pid = p["id"]
        sku = p["sku"]
        first_hex = p["variants"][0][2]
        main_svg = draw_archetype(p["arch"], sku, first_hex, "#7A3D49", p["sub"], f"{pid}-main", p["hasShades"])
        (PUB / "products" / f"{pid}.svg").write_text(main_svg, encoding="utf-8")

        for vid, vlabel, vhex in p["variants"]:
            v_svg = draw_archetype(p["arch"], sku, vhex, "#7A3D49", f"{p['sub']} • {vlabel}", f"{pid}-{vid}", p["hasShades"])
            (PUB / "products" / "variants" / f"{pid}-{vid}.svg").write_text(v_svg, encoding="utf-8")

        (PUB / "products" / "angles" / f"{pid}-swatch.svg").write_text(draw_swatch_angle(p), encoding="utf-8")
        (PUB / "products" / "angles" / f"{pid}-detail.svg").write_text(draw_detail_angle(p), encoding="utf-8")

    all_svgs = list(PUB.rglob("*.svg"))
    for svg_file in all_svgs:
        ET.fromstring(svg_file.read_text(encoding="utf-8"))
    print(f"Generated and XML-validated {len(all_svgs)} bespoke SVG studio assets in {PUB}")


if __name__ == "__main__":
    main()

