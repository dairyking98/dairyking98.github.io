#!/usr/bin/env python3
"""Create machine pages, pre-filled from _data/typewriters.yml.

    python3 bin/new-machine-page.py --list          machines and their page status
    python3 bin/new-machine-page.py --all           scaffold every machine with a serial
    python3 bin/new-machine-page.py 133130          one machine, by serial

Slugs are make-model-serial, so URLs read
/collections/typewriters/royal-quiet-de-luxe-a-873792/.

New pages carry `published: false`. They exist for you to fill in, but stay out
of the build — and therefore off the live site, out of the sitemap, and out of
the inventory table's links — until you delete that line. Preview them locally
with `bundle exec jekyll serve --unpublished`.

Specs are NOT written into the page. The spec block reads the data file at build
time via _includes/machine-spec.html, so editing the ledger updates every page
and the two can never disagree.

Private ledger fields (notes, work_needed, prices) are deliberately never
written here, not even as comments — comments ship in the page source and this
repository is public.
"""
import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "_data" / "typewriters.yml"
PAGES = ROOT / "_typewriters"
IMG = "/assets/img/2026/typewriters"

TEMPLATE = """---
title: "{title}"
serial: "{serial}"
# Delete the line below to publish this page.
published: false
excerpt: ""

# MAIN PHOTO — the one that opens the page. Uncomment once the file exists.
# header:
#   image: {img}/{slug}/main.jpg
#   teaser: {img}/{slug}/main.jpg

# GALLERY — the supporting shots. Add an entry per photo, then uncomment the
# gallery include in the body. url is the full-size image, image_path the
# thumbnail; the same file for both is fine to start.
# gallery:
#   - url: {img}/{slug}/gallery-01.jpg
#     image_path: {img}/{slug}/gallery-01.jpg
#     alt: ""
#   - url: {img}/{slug}/gallery-02.jpg
#     image_path: {img}/{slug}/gallery-02.jpg
#     alt: ""
---

<!-- INTRO: what makes this machine worth a page. One or two paragraphs. -->

{{% include machine-spec.html %}}

## Gallery

<!-- Add entries to the `gallery` array above, then uncomment:
{{% include gallery caption="{title}, serial {serial}." %}}
-->

## Type specimen

<!-- Full alphabet, digits, punctuation, on white paper.
Save as {img}/{slug}/specimen.jpg, then uncomment:
{{% include figure image_path="{img}/{slug}/specimen.jpg" alt="Type specimen from the {title}" caption="Typed on {serial}." %}}
-->

<!-- DISCUSSION: add a section per topic worth writing about — restoration,
     a repair, what it's like to type on, how you got it.

     Photos that belong to a specific point in the discussion go inline here
     rather than in the gallery above, so they sit next to the text that
     explains them:

     {{% include figure image_path="{img}/{slug}/<name>.jpg" alt="" caption="" %}}

     For a before/after pair, two figures back to back reads better than one
     combined image — each gets its own caption.
-->
"""


def slugify(text):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text.lower())).strip("-")


def title_of(machine):
    return " ".join(str(machine[k]) for k in ("manufacturer", "model") if machine.get(k))


def slug_of(machine):
    parts = [machine.get(k) for k in ("manufacturer", "model", "serial_number")]
    return slugify(" ".join(str(p) for p in parts if p))


def page_index():
    """Map serial -> (path, is_published) for every existing page."""
    index = {}
    for page in PAGES.glob("*.md"):
        match = re.match(r"^---\n(.*?)\n---", page.read_text(encoding="utf-8"), re.S)
        if not match:
            continue
        front = yaml.safe_load(match.group(1)) or {}
        if front.get("serial"):
            index[str(front["serial"])] = (page, front.get("published", True))
    return index


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("serial", nargs="?", help="serial number of one machine")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--all", action="store_true",
                    help="scaffold every machine that has a serial")
    args = ap.parse_args()

    machines = yaml.safe_load(DATA.open(encoding="utf-8"))
    with_serial = [m for m in machines if m.get("serial_number")]
    index = page_index()

    if args.list or not (args.serial or args.all):
        live = sum(1 for _, pub in index.values() if pub)
        print(f"{len(machines)} machines, {len(with_serial)} with a serial.")
        print(f"{len(index)} have a page — {live} published, {len(index) - live} draft.\n")
        for m in machines:
            serial = str(m.get("serial_number") or "")
            if serial in index:
                state = "published" if index[serial][1] else "draft"
            elif serial:
                state = "no page"
            else:
                state = "no serial"
            print(f"  {state:10}  {title_of(m)[:38]:38} {serial or '—'}")
        return

    targets = with_serial if args.all else [
        m for m in machines if str(m.get("serial_number")) == args.serial]
    if not targets:
        sys.exit(f"No machine with serial {args.serial!r}. Try --list.")

    made = skipped = 0
    for machine in targets:
        serial = str(machine["serial_number"])
        if serial in index:
            skipped += 1
            continue
        slug = slug_of(machine)
        path = PAGES / f"{slug}.md"
        if path.exists():
            skipped += 1
            continue
        PAGES.mkdir(exist_ok=True)
        path.write_text(TEMPLATE.format(
            title=title_of(machine), serial=serial, slug=slug, img=IMG,
        ), encoding="utf-8")
        made += 1
        if not args.all:
            print(f"  wrote {path.relative_to(ROOT)}")
            print(f"  /collections/typewriters/{slug}/  (draft — delete `published: false`)")

    if args.all:
        print(f"  created {made} pages, skipped {skipped} that already existed")
        print(f"  all drafts. Preview with: bundle exec jekyll serve --unpublished")


if __name__ == "__main__":
    main()
