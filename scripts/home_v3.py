"""Home (nov/2026): content/home.html is the versioned source; the build only versions local assets.

Every WhatsApp button carries data-contact, data-contact-message and data-placement: measurement.js
rewrites the link from data-contact-message, so the message the visitor sends is defined here, in the HTML.
"""
from pathlib import Path
import hashlib, re

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / 'content/home.html'
# Local assets referenced by the Home; measurement scripts are versioned for every page in build-site.py.
HOME_ASSETS = ('assets/home.css', 'assets/fiandeiros.js', 'assets/home.js', 'assets/mescla-logo.svg', 'assets/mescla-favicon.svg')


def versioned(asset):
    return '/' + asset + '?v=' + hashlib.sha256((ROOT / asset).read_bytes()).hexdigest()[:12]


def render_home():
    page = TEMPLATE.read_text()
    for asset in HOME_ASSETS:
        page = re.sub(r'(src|href)="/' + re.escape(asset) + r'(?:\?[^"]*)?"', lambda m: f'{m.group(1)}="{versioned(asset)}"', page)
    return page
