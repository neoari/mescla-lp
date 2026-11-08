"""Visual language shared by the segment pages."""
from pathlib import Path
from html import escape
import re, json

ROOT = Path(__file__).resolve().parents[1]

def ui_icon(name):
    source = (ROOT / 'assets/icons/lucide' / (name + '.svg')).read_text()
    source = re.sub(r'<!--.*?-->', '', source, flags=re.S).strip()
    source = re.sub(r'class="[^"]*"', 'class="ui-icon"', source, count=1)
    return source.replace('<svg', '<svg aria-hidden="true" focusable="false"', 1)

def brand_icon(name):
    source = (ROOT / 'assets/icons' / (name + '.svg')).read_text()
    source = re.sub(r'<title>.*?</title>', '', source, flags=re.S)
    source = re.sub(r'<svg[^>]*>', '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">', source, count=1)
    return f'<span class="brand-symbol brand-symbol--{name}">{source}</span>'

def motion_surface(slug, fallback):
    data=json.loads((ROOT/'content/motion-scenes.json').read_text())[slug]
    summary=' '.join(copy for title,copy in data['phases'])
    return f'<div class="animated-work" data-motion-scene="{slug}"><div class="motion-fallback">{fallback}</div><div class="motion-player" hidden></div><p class="motion-equivalent">{escape(data["label"])}. {escape(summary)} Exemplo ilustrativo; etapas definidas no projeto.</p></div>'
