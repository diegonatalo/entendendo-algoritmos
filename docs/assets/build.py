"""Gera os SVGs de docs/assets/ e o README.md a partir de theme.json e content.json.

Uso (na raiz do repositório): python docs/assets/build.py
Requer Pillow (para embutir os prints como data URI).
"""
import base64
import html
import io
import json
import re
import textwrap
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
THEMES = json.loads((ROOT / "theme.json").read_text(encoding="utf-8"))
C = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))

AUTHOR = "Diego Natalo"
YEAR = 2026
REPO_URL = f"https://github.com/diegonatalo/{C['repo']}"
LINKS = [
    ("Portfólio", "https://diegonatalo.dev"),
    ("LinkedIn", "https://www.linkedin.com/in/diegonatalo/"),
    ("GitHub", "https://github.com/diegonatalo"),
]
STACK = ["Next.js 16", "React 19", "TypeScript 5", "Tailwind CSS 4", "ESLint 9", "pnpm 11"]
BANNER_STACK = STACK[:4]
DOTS = ["#ff8a7a", "#f5d36a", "#34d399"]

esc = lambda s: html.escape(s, quote=True)


def plain(s):
    """Tira o Markdown inline para usar o texto dentro de um SVG."""
    return re.sub(r"\*\*|`", "", s)


def no_emoji(s):
    return re.sub(r"^[^\w]+", "", s).strip()


def svg(w, h, title, body, defs="", style="", bg=None):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        f'width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{esc(title)}">'
        f"<title>{esc(title)}</title><defs>{defs}</defs>"
        f"{('<style>' + style + '</style>') if style else ''}{body}</svg>"
    )


def glow_def(i, color, op=0.26):
    return (
        f'<radialGradient id="{i}"><stop offset="0" stop-color="{color}" stop-opacity="{op}"/>'
        f'<stop offset="1" stop-color="{color}" stop-opacity="0"/></radialGradient>'
    )


def grad_def(i, t, x1=0, x2=1):
    return (
        f'<linearGradient id="{i}" x1="{x1}" y1="0" x2="{x2}" y2="0">'
        f'<stop offset="0" stop-color="{t["accent"]}"/><stop offset="1" stop-color="{t["accent2"]}"/></linearGradient>'
    )


def data_uri(path, max_w=1280, max_h=None, limit=200_000, crop=None):
    im = Image.open(REPO / path).convert("RGB")
    if crop:
        im = im.crop(crop)
    scale = min(1, max_w / im.width, (max_h / im.height) if max_h else 1)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    for q in range(80, 30, -5):
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= limit:
            break
    uri = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    return uri, im.width, im.height, buf.tell()


# ───────────────────────── banner ─────────────────────────
def banner(t):
    W, H = 1200, 470
    uri, iw, ih, _ = data_uri("docs/img/busca-binaria.png", max_w=732, crop=(0, 0, 2020, 1600))
    words = C["name"].split()
    first, last = " ".join(words[:-1]), words[-1]
    pill_txt = f"github.com/diegonatalo/{C['repo']}".upper()
    pill_w = round(len(pill_txt) * (13 * 0.6 + 1.8) + 52)
    tag = textwrap.wrap(C["tagline"], 46)[:2]
    anim = t["animations"]
    defs = (
        glow_def("ga", t["accent"]) + glow_def("gb", t["accent2"]) + grad_def("g", t, 0, 1).replace('id="g"', 'id="g" gradientUnits="userSpaceOnUse"').replace('x1="0"', 'x1="72"').replace('x2="1"', 'x2="520"')
        + grad_def("gt", t)
        + f'<pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="{t["fg"]}" stroke-opacity="0.045"/></pattern>'
        + f'<clipPath id="cc"><rect width="{W}" height="{H}" rx="26"/></clipPath>'
        + '<clipPath id="shotclip"><rect x="770" y="86" width="366" height="290" /></clipPath>'
    )
    style = (
        "@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}.pulse{animation:pulse 2.4s ease-in-out infinite}"
        if anim else ""
    )
    drift = lambda dx, dy, d: (
        f'<animateTransform attributeName="transform" type="translate" values="0 0;{dx} {dy};0 0" dur="{d}s" repeatCount="indefinite"/>' if anim else ""
    )
    b = f'<g clip-path="url(#cc)"><rect width="{W}" height="{H}" fill="{t["bg"]}"/>'
    if t["grid"]:
        b += f'<rect width="{W}" height="{H}" fill="url(#grid)"/>'
    if t["glow"]:
        b += f'<circle cx="170" cy="40" r="330" fill="url(#ga)">{drift(30, 20, 14)}</circle>'
        b += f'<circle cx="1040" cy="420" r="380" fill="url(#gb)">{drift(-30, -20, 16)}</circle>'
    # pílula
    b += f'<rect x="72" y="62" width="{pill_w}" height="36" rx="18" fill="{t["accent"]}" fill-opacity="0.1" stroke="{t["accent"]}" stroke-opacity="0.38"/>'
    b += f'<circle class="pulse" cx="92" cy="80" r="4" fill="{t["accent"]}"/>'
    b += (
        f'<text x="106" y="85" font-family="{t["fontMono"]}" font-size="13" letter-spacing="1.8" fill="{t["muted"]}">{esc(pill_txt)}</text>'
    )
    # nome (duas palavras: uma por linha, para caber na coluna)
    b += f'<text x="72" y="166" font-family="{t["fontSans"]}" font-size="76" font-weight="800" letter-spacing="-3" fill="{t["fg"]}">{esc(first)}</text>'
    b += f'<text x="72" y="240" font-family="{t["fontSans"]}" font-size="76" font-weight="800" letter-spacing="-3" fill="url(#g)">{esc(last)}</text>'
    for i, ln in enumerate(tag):
        b += f'<text x="72" y="{296 + 28 * i}" font-family="{t["fontSans"]}" font-size="20" fill="{t["muted"]}">{esc(ln)}</text>'
    # chips
    x = 72
    for i, name in enumerate(BANNER_STACK):
        w = round(0.6 * 13 * len(name) + 38)
        b += chip(x, 362, w, name, i, t)
        x += w + 10
    # moldura
    b += f'<rect x="770" y="58" width="366" height="318" rx="20" fill="{t["card"]}" stroke="{t["borderStrong"]}"/>'
    b += f'<g clip-path="url(#shotclip)"><image x="770" y="86" width="366" height="290" preserveAspectRatio="xMidYMin slice" xlink:href="{uri}" href="{uri}"/></g>'
    b += f'<path d="M770 86H1136V376a20 20 0 0 1-20 20H790a20 20 0 0 1-20-20Z" fill="none"/>'
    b += f'<rect x="771" y="59" width="364" height="27" rx="19" fill="{t["card"]}"/><rect x="771" y="72" width="364" height="14" fill="{t["card"]}"/>'
    for i, c in enumerate(DOTS):
        b += f'<circle cx="{790 + i * 16}" cy="72" r="4.5" fill="{c}"/>'
    b += f'<text x="1124" y="76" text-anchor="end" font-family="{t["fontMono"]}" font-size="12" fill="{t["subtle"]}">/busca-binaria</text>'
    b += f'<rect x="770.5" y="58.5" width="365" height="317" rx="20" fill="none" stroke="{t["borderStrong"]}"/>'
    b += f'</g><rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="26" fill="none" stroke="{t["borderStrong"]}"/>'
    return svg(W, H, f"{C['name']}: {C['tagline']}", b, defs, style)


def chip(x, y, w, name, i, t):
    dot = t["accent"] if i % 2 == 0 else t["accent2"]
    return (
        f'<rect x="{x}" y="{y}" width="{w}" height="32" rx="16" fill="{t["bg"]}" stroke="{t["borderStrong"]}"/>'
        f'<circle cx="{x + 16}" cy="{y + 16}" r="3.5" fill="{dot}"/>'
        f'<text x="{x + 27}" y="{y + 21}" font-family="{t["fontMono"]}" font-size="13" fill="{t["fg"]}">{esc(name)}</text>'
    )


# ───────────────────────── botões ─────────────────────────
def button(label, primary, t):
    txt = f"{label} ↗"
    w = round(len(txt) * 16 * 0.58 + 56)
    defs = grad_def("g", t)
    if primary:
        body = f'<rect width="{w}" height="52" rx="26" fill="url(#g)"/>'
        fill = t["onAccent"]
    else:
        body = f'<rect x="0.75" y="0.75" width="{w - 1.5}" height="50.5" rx="25.25" fill="{t["card"]}" stroke="{t["borderStrong"]}" stroke-width="1.5"/>'
        fill = t["fg"]
    body += f'<text x="{w / 2}" y="32" text-anchor="middle" font-family="{t["fontSans"]}" font-size="16" font-weight="700" fill="{fill}">{esc(txt)}</text>'
    return svg(w, 52, txt, body, defs)


# ───────────────────────── cabeçalho de seção ─────────────────────────
def header(n, label, title, t):
    W, H = 1000, 124
    pill = f"{n:02d} · {label}"
    pw = round(len(pill) * 9.4 + 34)
    defs = (
        glow_def("ga", t["accent"], 0.16) + glow_def("gb", t["accent2"], 0.16) + grad_def("g", t)
        + f'<clipPath id="cc"><rect width="{W}" height="{H}" rx="22"/></clipPath>'
    )
    b = f'<g clip-path="url(#cc)"><rect width="{W}" height="{H}" fill="{t["card"]}"/>'
    b += f'<circle cx="{W}" cy="0" r="220" fill="url(#gb)"/><circle cx="0" cy="{H}" r="200" fill="url(#ga)"/></g>'
    b += f'<rect x="40" y="26" width="{pw}" height="28" rx="14" fill="{t["accent"]}" fill-opacity="0.1" stroke="{t["accent"]}" stroke-opacity="0.38"/>'
    b += f'<text x="57" y="45" font-family="{t["fontMono"]}" font-size="12" letter-spacing="1.6" fill="{t["accent"]}">{esc(pill)}</text>'
    b += f'<text x="40" y="94" font-family="{t["fontSans"]}" font-size="36" font-weight="800" letter-spacing="-0.8" fill="{t["fg"]}">{esc(title)}</text>'
    b += f'<rect x="40" y="106" width="64" height="3" rx="1.5" fill="url(#g)"/>'
    b += f'<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="22" fill="none" stroke="{t["borderStrong"]}"/>'
    return svg(W, H, f"{pill}: {title}", b, defs)


# ───────────────────────── card de funcionalidade ─────────────────────────
def feature(i, title, desc, t):
    W, H = 490, 290
    fs = 28
    est = len(title) * fs * 0.56
    if est > W - 64:
        fs = round(fs * (W - 64) / est, 1)
    lines = textwrap.wrap(plain(desc), 54)[:5]
    defs = (
        glow_def("ga", t["accent"], 0.16) + grad_def("g", t)
        + f'<clipPath id="cc"><rect width="{W}" height="{H}" rx="22"/></clipPath>'
    )
    b = f'<g clip-path="url(#cc)"><rect width="{W}" height="{H}" fill="{t["card"]}"/><circle cx="{W}" cy="0" r="200" fill="url(#ga)"/>'
    b += f'<rect width="{W}" height="4" fill="url(#g)"/></g>'
    b += f'<text x="32" y="44" font-family="{t["fontMono"]}" font-size="12" letter-spacing="1.4" fill="{t["subtle"]}">FUNCIONALIDADE {i:02d}</text>'
    b += f'<text x="32" y="82" font-family="{t["fontSans"]}" font-size="{fs}" font-weight="700" fill="{t["fg"]}">{esc(plain(title))}</text>'
    for k, ln in enumerate(lines):
        b += f'<text x="32" y="{116 + 22 * k}" font-family="{t["fontSans"]}" font-size="14.5" fill="{t["muted"]}">{esc(ln)}</text>'
    b += f'<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="22" fill="none" stroke="{t["borderStrong"]}"/>'
    return svg(W, H, f"{plain(title)}: {plain(desc)}", b, defs)


# ───────────────────────── stack ─────────────────────────
def stack(t):
    W, pad, maxx = 1000, 26, 1000 - 26
    x, row, placed = pad, 0, []
    for i, name in enumerate(STACK):
        w = round(0.6 * 13 * len(name) + 38)
        if x + w > maxx:
            x, row = pad, row + 1
        placed.append((x, pad + row * 40, w, name, i))
        x += w + 10
    H = 2 * pad + row * 40 + 32
    b = f'<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="20" fill="{t["card"]}" stroke="{t["borderStrong"]}"/>'
    b += "".join(chip(x, y, w, n, i, t) for x, y, w, n, i in placed)
    return svg(W, H, "Stack: " + ", ".join(STACK), b)


# ───────────────────────── telas (tema neutro: os prints já são escuros) ─────────────────────────
SHOT = dict(card="#18181b", bar="#111113", border="#3f3f46", accent="#34d399")


def window_bar(w, title):
    b = f'<rect width="{w}" height="28" fill="{SHOT["bar"]}"/>'
    for i, c in enumerate(DOTS):
        b += f'<circle cx="{18 + i * 16}" cy="14" r="4.5" fill="{c}"/>'
    b += f'<text x="{w // 2}" y="18" text-anchor="middle" font-family="\'Geist Mono\',Menlo,Consolas,monospace" font-size="11" fill="#71717a">{esc(title)}</text>'
    return b


def shot(src, alt):
    uri, iw, ih, _ = data_uri(src)
    W = 1000
    fh = round(W * ih / iw) + 28
    H = fh + 28
    defs = (
        glow_def("gl", SHOT["accent"], 0.2)
        + f'<clipPath id="cc"><rect width="{W}" height="{fh}" rx="16"/></clipPath>'
    )
    b = f'<ellipse cx="{W / 2}" cy="{fh}" rx="380" ry="26" fill="url(#gl)"/>'
    b += f'<g clip-path="url(#cc)"><rect width="{W}" height="{fh}" fill="{SHOT["card"]}"/>{window_bar(W, Path(src).name)}'
    b += f'<image y="28" width="{W}" height="{fh - 28}" xlink:href="{uri}" href="{uri}"/></g>'
    b += f'<rect x="0.5" y="0.5" width="{W - 1}" height="{fh - 1}" rx="16" fill="none" stroke="{SHOT["border"]}"/>'
    return svg(W, H, alt, b, defs)


def shot_mobile(imgs):
    W, ph, gap = 1000, 560, 44
    parts = []
    for src, alt in imgs:
        uri, iw, ih, _ = data_uri(src, max_w=600, max_h=1200, limit=200_000)
        parts.append((uri, round(ph * iw / ih), alt, Path(src).name))
    total = sum(p[1] for p in parts) + gap * (len(parts) - 1)
    fh = 28 + ph + 48
    H = fh + 28
    defs = glow_def("gl", SHOT["accent"], 0.2) + f'<clipPath id="cc"><rect width="{W}" height="{fh}" rx="16"/></clipPath>'
    b = f'<ellipse cx="{W / 2}" cy="{fh}" rx="380" ry="26" fill="url(#gl)"/>'
    b += f'<g clip-path="url(#cc)"><rect width="{W}" height="{fh}" fill="{SHOT["card"]}"/>{window_bar(W, "celular")}'
    x = (W - total) / 2
    for i, (uri, w, alt, name) in enumerate(parts):
        b += f'<clipPath id="m{i}"><rect x="{x}" y="52" width="{w}" height="{ph}" rx="14"/></clipPath>'
        b += f'<image x="{x}" y="52" width="{w}" height="{ph}" clip-path="url(#m{i})" xlink:href="{uri}" href="{uri}"/>'
        b += f'<rect x="{x}" y="52" width="{w}" height="{ph}" rx="14" fill="none" stroke="{SHOT["border"]}"/>'
        x += w + gap
    b += "</g>"
    b += f'<rect x="0.5" y="0.5" width="{W - 1}" height="{fh - 1}" rx="16" fill="none" stroke="{SHOT["border"]}"/>'
    return svg(W, H, " ".join(a for _, a in imgs), b, defs)


# ───────────────────────── rodapé ─────────────────────────
def footer(t):
    W, H = 1000, 90
    defs = grad_def("g", t)
    b = f'<rect x="0" y="14" width="{W}" height="2" fill="url(#g)" opacity="0.7"/>'
    b += f'<text x="{W / 2}" y="52" text-anchor="middle" font-family="{t["fontMono"]}" font-size="12.5" fill="{t["subtle"]}">© {YEAR} {AUTHOR.upper()}</text>'
    b += f'<text x="{W / 2}" y="74" text-anchor="middle" font-family="{t["fontSans"]}" font-size="14" fill="{t["muted"]}">{esc(C["footer_license"])}</text>'
    return svg(W, H, f"© {YEAR} {AUTHOR}. {C['footer_license']}", b, defs)


# ───────────────────────── escrita dos arquivos ─────────────────────────
def write_themed(name, fn):
    for mode, t in THEMES.items():
        d = ROOT / mode
        d.mkdir(exist_ok=True)
        (d / name).write_text(fn(t), encoding="utf-8")


def pic(name, alt, attrs='width="100%"'):
    return (
        f'<picture><source media="(prefers-color-scheme: dark)" srcset="docs/assets/dark/{name}">'
        f'<img src="docs/assets/light/{name}" alt="{esc(alt)}" {attrs}></picture>'
    )


def linked(href, name, alt, attrs):
    return f'<a href="{href}">{pic(name, alt, attrs)}</a>'


def main():
    write_themed("banner.svg", banner)
    write_themed("btn-demo.svg", lambda t: button("Demonstração", True, t))
    write_themed("btn-code.svg", lambda t: button("Código", False, t))
    for lbl, _ in LINKS:
        write_themed(f"btn-{lbl.lower().replace('ó', 'o')}.svg", lambda t, l=lbl: button(l, False, t))
    write_themed("stack.svg", stack)
    write_themed("footer.svg", footer)
    for i, it in enumerate(C["features"]["items"], 1):
        write_themed(f"f-{i:02d}.svg", lambda t, i=i, it=it: feature(i, it["title"], it["desc"], t))

    sections = []  # (rótulo, título)

    def sec(label, title):
        n = len(sections) + 1
        sections.append(label)
        key = f"h-{n:02d}-{label.lower().replace(' ', '-')}.svg"
        write_themed(key, lambda t: header(n, label, title, t))
        return f'<div align="center">\n{pic(key, f"{n:02d} · {label}: {title}")}\n</div>\n'

    # shots
    for i, s in enumerate(C["telas"]["shots"], 1):
        (ROOT / f"shot-{i}.svg").write_text(shot(s["src"], s["alt"]), encoding="utf-8")
    (ROOT / "shot-mobile.svg").write_text(shot_mobile(C["telas"]["mobile"]["imgs"]), encoding="utf-8")

    out = []
    # banner + botões + badges
    head = '<div align="center">\n\n' + pic("banner.svg", f"{C['name']}: {C['tagline']}") + "\n\n<br />\n\n"
    head += linked(C["app_url"], "btn-demo.svg", "Demonstração", 'height="46"') + "&nbsp;&nbsp;"
    head += linked(REPO_URL, "btn-code.svg", "Código", 'height="46"') + "\n\n<br />\n\n"
    head += C["badges_md"] + "\n\n</div>\n\n<br />\n"
    out.append(head)

    # 01 sobre
    s = sec("SOBRE", "Sobre o projeto")
    sc = C["sobre_conteudo"]
    out.append(s + f"\n{C['intro_md']}\n\n{C['note_md']}\n\n### {sc['title']}\n\n{sc['md']}\n\n<br />\n")

    # 02 demo
    s = sec("DEMO", no_emoji(C["telas"]["title"]))
    body = '<div align="center">\n\n'
    for i, sh in enumerate(C["telas"]["shots"], 1):
        body += f'<img src="docs/assets/shot-{i}.svg" alt="{esc(sh["alt"])}" width="100%">\n<br /><sub>{sh["caption"]}</sub>\n\n<br />\n\n'
    m = C["telas"]["mobile"]
    body += f'<img src="docs/assets/shot-mobile.svg" alt="{esc(" ".join(a for _, a in m["imgs"]))}" width="100%">\n<br /><sub>{m["caption"]}</sub>\n\n</div>\n\n<br />\n'
    out.append(s + "\n" + body)

    # 03 funcionalidades
    s = sec("FUNCIONALIDADES", no_emoji(C["features"]["title"]))
    items = C["features"]["items"]
    body = '<div align="center">\n\n'
    for i, it in enumerate(items, 1):
        body += pic(f"f-{i:02d}.svg", f"{plain(it['title'])}: {plain(it['desc'])}", 'width="49%"')
        body += "\n" if i % 2 else "\n<br />\n"
    body += "\n</div>\n\n<br />\n"
    out.append(s + "\n" + body)

    # 04 stack
    s = sec("STACK", "Stack")
    out.append(s + f'\n<div align="center">\n\n{pic("stack.svg", "Stack: " + ", ".join(STACK))}\n\n</div>\n\n<br />\n')

    # 05 como rodar
    s = sec("COMO RODAR", no_emoji(C["run"]["title"]))
    out.append(s + f"\n{C['run']['md']}\n\n### {C['env']['title']}\n\n{C['env']['md']}\n\n<br />\n")

    # 06 estrutura
    s = sec("ESTRUTURA", no_emoji(C["estrutura"]["title"]))
    out.append(s + f"\n{C['estrutura']['md']}\n\n<br />\n")

    # 07 mais
    s = sec("MAIS", "Mais informações")
    mais = "\n\n<br />\n\n".join(f"### {x['title']}\n\n{x['md']}" for x in C["mais"])
    out.append(s + f"\n{mais}\n\n<br />\n")

    # 08 autor
    s = sec("AUTOR", "Autor")
    btns = "&nbsp;&nbsp;".join(
        linked(u, f"btn-{l.lower().replace('ó', 'o')}.svg", l, 'height="46"') for l, u in LINKS
    )
    out.append(s + f'\n<div align="center">\n\n{btns}\n\n</div>\n\n<br />\n')

    # rodapé
    out.append(f'<div align="center">\n\n{pic("footer.svg", "© " + str(YEAR) + " " + AUTHOR + ". " + C["footer_license"])}\n\n{C["footer_md"]}\n\n</div>\n')

    (REPO / "README.md").write_text("\n".join(out), encoding="utf-8")
    print("ok:", ", ".join(sections))


if __name__ == "__main__":
    main()
