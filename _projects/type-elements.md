---
layout: single
title: 3D-Printed Type Elements
description: Parametric OpenSCAD type elements, 3D-printed in resin to restore and extend antique typewriters — Blickensderfer, IBM Selectric, Bennett, Helios Klimax, Hammond, Mignon, and Postal.
header:
  teaser: /assets/img/2026/type-elements/hammond-split-shuttle.png
importance: 1
category: 3d type elements
github: https://github.com/dairyking98/Type-Elements
toc: true
toc_label: "Machines"
toc_sticky: true
---

Since 2022 I've been designing replacement type elements for antique typewriters — the small, precise components (typewheels, spherical "golf balls," vulcanized rubber elements) that are frequently missing, damaged, or were never available in a given typeface to begin with. Each is modeled parametrically in OpenSCAD and 3D printed in high-precision resin, with per-machine dimensions and calibration values tracked in the [Type-Elements repository](https://github.com/dairyking98/Type-Elements). Machines below, roughly in the order I tackled them.

## Blickensderfer Typewheels {#blickensderfer}

The first type element I ever attempted, done in collaboration with **Brent Carter**, who handled font design and digitization while I handled the 3D printing and mechanical engineering. Early prototypes were modeled in Fusion 360 — [validated with outsourced resin prints in this video](https://www.youtube.com/watch?v=fJSAW26kJwg) — before I bought my own resin printer and switched to OpenSCAD, which handled the parametric draft-angle geometry far better than Fusion 360 could.

The result: brand-new typewheels for Blickensderfer models 5, 6, 7, 8, 9, and the Home Blick, in both DHIATENSOR and QWERTY layouts, including typefaces never previously available for these machines — Steile Zierschrift, Goudy italic, and Script/Vogue. The project was [featured on Typewriter Revolution](https://typewriterrevolution.com/new-typewheels-for-the-blickensderfer-typewriter/).

{% include figure image_path="/assets/img/2026/type-elements/blickensderfer.png" alt="Blickensderfer typewheel OpenSCAD render" caption="v4-generated Blickensderfer typewheel." %}

<!-- PHOTO NEEDED (nice-to-have upgrade): a real printed Blickensderfer typewheel, ideally installed in a machine.
Save as assets/img/2026/type-elements/blickensderfer-printed.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/type-elements/blickensderfer-printed.jpg" alt="Printed Blickensderfer typewheel" caption="Resin-printed Blickensderfer typewheel, installed." %}
-->

{% assign blickensderfers = site.data.typewriters | where: "manufacturer", "Blickensderfer" %}
{% if blickensderfers.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in blickensderfers %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## IBM Selectric Type Elements {#ibm-selectric}

The second attempt, starting with a Fusion 360 prototype — then shelved after another OpenSCAD Selectric model was released and I assumed the problem was already solved. It got reignited when a collector friend in Finland acquired a rare **IBM Selectric Composer** (a proportional/justified-type variant of the Selectric) and needed elements for it.

That became a fully remote collaboration: I designed in OpenSCAD and generated STL files from the US, he printed and tested them in Finland, and we iterated on fitment and character quality through photos and feedback with neither of us having direct access to the other's hardware. Once dialed in for the Composer, the system was generalized to work for standard Selectrics too — fully parametric, accepting any keyboard layout, any font, and any key arrangement.

{% include figure image_path="/assets/img/2026/type-elements/ibm-selectric-composer.png" alt="IBM Selectric Composer typeball OpenSCAD render" caption="v4-generated Selectric Composer typeball — the machine that started this whole collaboration." %}

<!-- PHOTO NEEDED (nice-to-have upgrade): a real printed IBM Selectric typeball, ideally installed and typed with.
Save as assets/img/2026/type-elements/ibm-selectric-printed.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/type-elements/ibm-selectric-printed.jpg" alt="Printed IBM Selectric typeball" caption="Resin-printed Selectric typeball, installed and tested." %}
-->

{% assign ibm_selectrics = site.data.typewriters | where_exp: "tw", "tw.model contains 'Selectric'" %}
{% if ibm_selectrics.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in ibm_selectrics %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Bennett Type Elements {#bennett}

The third project, and a different challenge from the previous two: Bennett Pocket Typewriters (c. 1910) use type elements made of vulcanized rubber, which is fragile and prone to cracking with age — original elements are scarce and often too damaged to use. Getting the geometry right took many OpenSCAD iterations, since the Bennett's construction differs significantly from both the Blickensderfer and Selectric designs. The resin-printed result ended up more durable than the original rubber elements.

{% include figure image_path="/assets/img/2026/type-elements/bennett.png" alt="Bennett type element OpenSCAD render" caption="v4-generated Bennett type element." %}

<!-- PHOTO NEEDED (nice-to-have upgrade): a printed Bennett rubber-replacement type element, ideally next to a cracked/damaged original for contrast.
Save as assets/img/2026/type-elements/bennett-printed.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/type-elements/bennett-printed.jpg" alt="Printed Bennett type element" caption="Resin-printed Bennett type element, next to an original vulcanized-rubber element for comparison." %}
-->

{% assign bennetts = site.data.typewriters | where: "manufacturer", "Bennett" %}
{% if bennetts.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in bennetts %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Helios Klimax Type Elements {#helios-klimax}

The fourth, done for a collector friend in Germany rather than my own collection. The Helios Klimax is an unusual and rare German typewriter with its own mechanical quirks, so this was another back-and-forth collaboration — he supplied measurements, photos, and fitment feedback on his damaged original, and I iterated the OpenSCAD model remotely until it fit and printed correctly on his end.

{% include figure image_path="/assets/img/2026/type-elements/helios-klimax-render.png" alt="Helios Klimax type element OpenSCAD render" caption="v4-generated Helios Klimax type element." %}

{% include figure image_path="/assets/img/2026/type-elements/helios-klimax.png" alt="Helios Klimax logo" caption="The logo from the original element." %}

## Hammond Shuttles & Index {#hammond}

Hammond typewriters print from a curved **shuttle** — a die-cast type bar arranged in an arc — rather than a typebar or wheel, and later models could swap shuttles to change typeface or language entirely. But the shuttle design itself changed early on: the very first **Hammond Model 1** used a two-piece **split shuttle** — a much more complex mechanism built around precision telescoping tubes and a rudimentary type-selection linkage. It was fairly quickly superseded by the conventional one-piece curved shuttle, which then stuck around essentially unchanged for the rest of Hammond's run and on into Varityper machines in the 1940s. Because so few split shuttles were made and the design is that much harder to keep intact, working originals are rare and highly desirable to collectors — frequently missing or damaged is the norm, not the exception.

This directory covers both the Model 1 split shuttle and the conventional standard shuttle used from the Multiplex onward, plus the index variant and a Glagolitic shuttle for the old Slavic script. I own two Hammond Multiplex machines myself, including one still waiting on a mathematical shuttle.

{% include figure image_path="/assets/img/2026/type-elements/hammond-split-shuttle.png" alt="Hammond Model 1 split shuttle OpenSCAD render" caption="Hammond Model 1 split shuttle — the original two-piece telescoping-tube mechanism, superseded by the conventional one-piece shuttle used from the Multiplex onward." %}

{% assign hammonds = site.data.typewriters | where: "manufacturer", "Hammond" %}
{% if hammonds.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in hammonds %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Mignon Index Elements {#mignon}

The AEG Mignon (models 2/3/4) is an index typewriter — instead of a keyboard, you guide a pointer over a printed character index and press a lever to print. The cylindrical index element supports 32+ languages through a shared layout system, so a new language is a matter of generating a new index rather than redesigning the mechanism.

{% include figure image_path="/assets/img/2026/type-elements/mignon.png" alt="Mignon index element OpenSCAD render" caption="v4-generated Mignon index cylinder." %}

<!-- PHOTO NEEDED (nice-to-have upgrade): a printed Mignon index cylinder, ideally installed in the machine.
Save as assets/img/2026/type-elements/mignon-printed.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/type-elements/mignon-printed.jpg" alt="Printed Mignon index element" caption="Resin-printed Mignon index cylinder, installed." %}
-->

{% assign mignons = site.data.typewriters | where: "manufacturer", "Mignon" %}
{% if mignons.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in mignons %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Postal Type Elements {#postal}

A calibrated element for the Postal No. 3 (c. 1901–08) — one of which is in my own collection.

{% include figure image_path="/assets/img/2026/type-elements/postal.png" alt="Postal No. 3 type element OpenSCAD render" caption="v4-generated Postal No. 3 type element." %}

<!-- PHOTO NEEDED (nice-to-have upgrade): a printed Postal No. 3 type element, ideally installed in the machine.
Save as assets/img/2026/type-elements/postal-printed.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/type-elements/postal-printed.jpg" alt="Printed Postal No. 3 type element" caption="Resin-printed Postal No. 3 type element, installed." %}
-->

{% assign postals = site.data.typewriters | where: "manufacturer", "Postal" %}
{% if postals.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in postals %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## v4: Rebuilt Pipeline {#v4}

The whole toolchain got a ground-up rewrite as **v4**, moving from per-machine scripts to a shared pipeline with common glyph handling, logging, and tooling:

- **Adaptive glyph-contour tracing** replaces a fixed `points_per_mm` sampling rate with a `flatness_tolerance_mm`-driven adaptive tracer — denser sampling on tight curves, sparser on straight runs, instead of one blanket resolution for every glyph
- **Cross-platform setup** — `setup.sh`/`setup.bat` bootstrap the environment on Linux/macOS and Windows alike, including auto-installing [f3d](https://f3d.app/) for STL preview
- **`tune.py`** (the interactive calibration/preview GUI) got a reworked machine picker — Cylinders/Shuttles/Spheres grouped into their own columns instead of one long collapsible tree — plus a real Layout tab for the Selectric family and per-machine config scratch copies so edits to one machine's settings can't bleed into another's
- **Resin selection notes** — documented tradeoffs between glyph fidelity and toughness across resin types, from real print testing
- **Unified console logging** (`lib/build_log.py`) across every machine script, replacing ad hoc `print()` calls with consistent per-character and mesh-summary output

## Process

All of these use the same basic workflow: parametric modeling in OpenSCAD, high-precision resin 3D printing, and iterative fitment testing against the real mechanism — either in person or, for the Selectric Composer and Helios Klimax, entirely over email with collaborators on other continents.

For inquiries about custom type elements or collaboration, reach out via email or [Instagram (@blick_elements)](https://instagram.com/blick_elements).
