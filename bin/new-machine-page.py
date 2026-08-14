#!/usr/bin/env python3
"""Create a page for one machine, pre-filled from _data/typewriters.yml.

    python3 bin/new-machine-page.py --list         which machines have no page
    python3 bin/new-machine-page.py 133130         by serial
    python3 bin/new-machine-page.py 12             by number from --list
    python3 bin/new-machine-page.py 133130 --slug blickensderfer-no-5-b

Pages are written on demand rather than generated for every machine: a page per
machine would mean dozens of near-identical stubs showing a spec table and
nothing else. The inventory table links a model name only when a page exists,
so machines without one stay plain text and nothing 404s.

Specs are NOT copied into the page — the page carries prose, and the spec block
reads _data/typewriters.yml at build time via _includes/machine-spec.html. That
way editing the ledger updates the page too, and the two can never disagree.
"""
import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "_data" / "typewriters.yml"
PAGES = ROOT / "_typewriters"

TEMPLATE = """---
title: "{title}"
{matcher}excerpt: "{excerpt}"
---

<!-- TODO: open with what makes this machine worth a page — the thing you'd
     say about it if someone picked it up off the shelf. One or two paragraphs.
     Delete this comment when you've written it. -->

{{% include machine-spec.html %}}

## Why this one

<!-- TODO: why you keep it. This is the part no other site has. -->

## Type sample

<!-- PHOTO NEEDED: full alphabet, digits, punctuation, on white paper.
Save as assets/img/2026/typewriters/{slug}-sample.jpg, then uncomment:
{{% include figure image_path="/assets/img/2026/typewriters/{slug}-sample.jpg" alt="Type sample from the {title}" caption="Typed on {serial_caption}." %}}
-->

## Restoration

<!-- TODO: what you've done to it, and what's still outstanding. -->

## Gallery

<!-- PHOTO NEEDED: 2-4 shots — the machine whole, and whatever detail matters.
Save as assets/img/2026/typewriters/{slug}-##.jpg, add a `gallery` array to the
front matter above, then uncomment:
{{% include gallery caption="{title}." %}}
-->
"""


def slugify(text):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text.lower())).strip("-")


def describe(machine):
    return " ".join(str(machine[k]) for k in ("manufacturer", "model") if machine.get(k))


def existing_pages():
    """Map every page back to the machine it claims, so --list is accurate."""
    claimed_serials, claimed_models = set(), set()
    for page in PAGES.glob("*.md"):
        text = page.read_text(encoding="utf-8")
        match = re.match(r"^---\n(.*?)\n---", text, re.S)
        if not match:
            continue
        front = yaml.safe_load(match.group(1)) or {}
        if front.get("serial"):
            claimed_serials.add(str(front["serial"]))
        elif front.get("match_model"):
            claimed_models.add((front.get("match_maker"), front["match_model"]))
    return claimed_serials, claimed_models


def has_page(machine, serials, models):
    if machine.get("serial_number"):
        return str(machine["serial_number"]) in serials
    return (machine.get("manufacturer"), machine.get("model")) in models


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("machine", nargs="?", help="serial number, or a number from --list")
    ap.add_argument("--list", action="store_true", help="machines with no page yet")
    ap.add_argument("--slug", help="override the generated filename")
    args = ap.parse_args()

    machines = yaml.safe_load(DATA.open(encoding="utf-8"))
    serials, models = existing_pages()
    without = [m for m in machines if not has_page(m, serials, models)]

    if args.list or not args.machine:
        print(f"{len(machines) - len(without)} of {len(machines)} machines have a page.\n")
        for i, m in enumerate(without, 1):
            serial = m.get("serial_number") or "no serial"
            print(f"  {i:>3}  {describe(m)[:40]:40} {serial}")
        print("\nCreate one with:  python3 bin/new-machine-page.py <serial|number>")
        return

    # Accept either a serial or a 1-based index into the --list output.
    target = None
    if args.machine.isdigit() and 1 <= int(args.machine) <= len(without):
        by_serial = [m for m in machines if str(m.get("serial_number")) == args.machine]
        target = by_serial[0] if by_serial else without[int(args.machine) - 1]
    else:
        matches = [m for m in machines if str(m.get("serial_number")) == args.machine]
        if not matches:
            sys.exit(f"No machine with serial {args.machine!r}. Try --list.")
        target = matches[0]

    if has_page(target, serials, models):
        sys.exit(f"{describe(target)} already has a page.")

    # Serial is the reliable key. Without one, fall back to maker+model — but
    # say so if that's ambiguous, because several Quiet De Luxes share a name.
    if target.get("serial_number"):
        matcher = f'serial: "{target["serial_number"]}"\n'
        serial_caption = target["serial_number"]
    else:
        twins = [m for m in machines
                 if m.get("manufacturer") == target.get("manufacturer")
                 and m.get("model") == target.get("model")]
        if len(twins) > 1:
            print(f"  ! {describe(target)} has no serial and {len(twins)} machines share "
                  f"that maker and model. The spec block will bind to the first one.")
            print(f"  ! Record a serial in the ledger to disambiguate.")
        matcher = (f'match_maker: "{target.get("manufacturer")}"\n'
                   f'match_model: "{target.get("model")}"\n')
        serial_caption = describe(target)

    slug = args.slug or slugify(describe(target))
    path = PAGES / f"{slug}.md"
    if path.exists():
        sys.exit(f"{path.relative_to(ROOT)} already exists. Pass --slug to pick another name.")

    PAGES.mkdir(exist_ok=True)
    path.write_text(TEMPLATE.format(
        title=describe(target),
        matcher=matcher,
        excerpt=f"{describe(target)}" + (f", serial {target['serial_number']}."
                                         if target.get("serial_number") else "."),
        slug=slug,
        serial_caption=serial_caption,
    ), encoding="utf-8")

    print(f"  wrote {path.relative_to(ROOT)}")
    print(f"  will publish at /collections/typewriters/{slug}/")
    print(f"  the inventory table will link to it automatically on the next build")


if __name__ == "__main__":
    main()
