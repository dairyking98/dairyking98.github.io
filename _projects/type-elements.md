---
layout: single
title: 3D-Printed Type Elements
description: Parametric OpenSCAD type elements, 3D-printed in resin to restore and extend antique typewriters — Blickensderfer, IBM Selectric, Bennett, Helios Klimax, Hammond, Mignon, and Postal.
header:
  teaser: /assets/img/12.jpg
importance: 1
category: 3d type elements
github: https://github.com/dairyking98/Type-Elements
---

Since 2022 I've been designing replacement type elements for antique typewriters — the small, precise components (typewheels, spherical "golf balls," vulcanized rubber elements) that are frequently missing, damaged, or were never available in a given typeface to begin with. Each is modeled parametrically in OpenSCAD and 3D printed in high-precision resin, with per-machine dimensions and calibration values tracked in the [Type-Elements repository](https://github.com/dairyking98/Type-Elements). Machines below, roughly in the order I tackled them.

## Blickensderfer Typewheels {#blickensderfer}

The first type element I ever attempted, done in collaboration with **Brent Carter**, who handled font design and digitization while I handled the 3D printing and mechanical engineering. Early prototypes were modeled in Fusion 360 — [validated with outsourced resin prints in this video](https://www.youtube.com/watch?v=fJSAW26kJwg) — before I bought my own resin printer and switched to OpenSCAD, which handled the parametric draft-angle geometry far better than Fusion 360 could.

The result: brand-new typewheels for Blickensderfer models 5, 6, 7, 8, 9, and the Home Blick, in both DHIATENSOR and QWERTY layouts, including typefaces never previously available for these machines — Steile Zierschrift, Goudy italic, and Script/Vogue. The project was [featured on Typewriter Revolution](https://typewriterrevolution.com/new-typewheels-for-the-blickensderfer-typewriter/).

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

{% assign ibm_selectrics = site.data.typewriters | where_exp: "tw", "tw.model contains 'Selectric'" %}
{% if ibm_selectrics.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in ibm_selectrics %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Bennett Type Elements {#bennett}

The third project, and a different challenge from the previous two: Bennett Pocket Typewriters (c. 1910) use type elements made of vulcanized rubber, which is fragile and prone to cracking with age — original elements are scarce and often too damaged to use. Getting the geometry right took many OpenSCAD iterations, since the Bennett's construction differs significantly from both the Blickensderfer and Selectric designs. The resin-printed result ended up more durable than the original rubber elements.

{% assign bennetts = site.data.typewriters | where: "manufacturer", "Bennett" %}
{% if bennetts.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in bennetts %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Helios Klimax Type Elements {#helios-klimax}

The fourth, done for a collector friend in Germany rather than my own collection. The Helios Klimax is an unusual and rare German typewriter with its own mechanical quirks, so this was another back-and-forth collaboration — he supplied measurements, photos, and fitment feedback on his damaged original, and I iterated the OpenSCAD model remotely until it fit and printed correctly on his end.

## Hammond Shuttles & Index {#hammond}

Hammond typewriters print from a curved, two-row **shuttle** — a die-cast type bar arranged in an arc — rather than a typebar or wheel, and later models could swap shuttles to change typeface or language entirely. This directory covers the standard shuttle, two split-shuttle iterations (the Multiplex prints from two mirror-image halves that slide onto a central folder tube), the index variant, and a Glagolitic shuttle for the old Slavic script. I own two Hammond Multiplex machines myself, including one still waiting on a mathematical shuttle.

{% assign hammonds = site.data.typewriters | where: "manufacturer", "Hammond" %}
{% if hammonds.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in hammonds %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Mignon Index Elements {#mignon}

The AEG Mignon (models 2/3/4) is an index typewriter — instead of a keyboard, you guide a pointer over a printed character index and press a lever to print. The cylindrical index element supports 32+ languages through a shared layout system, so a new language is a matter of generating a new index rather than redesigning the mechanism.

{% assign mignons = site.data.typewriters | where: "manufacturer", "Mignon" %}
{% if mignons.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in mignons %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Postal Type Elements {#postal}

A calibrated element for the Postal No. 3 (c. 1901–08) — one of which is in my own collection.

{% assign postals = site.data.typewriters | where: "manufacturer", "Postal" %}
{% if postals.size > 0 %}
Related typewriters in my [collection]({{ '/typewriter-collection/' | relative_url }}):
{% for tw in postals %}
- {{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}
{% endfor %}
{% endif %}

## Process

All of these use the same basic workflow: parametric modeling in OpenSCAD, high-precision resin 3D printing, and iterative fitment testing against the real mechanism — either in person or, for the Selectric Composer and Helios Klimax, entirely over email with collaborators on other continents.

For inquiries about custom type elements or collaboration, reach out via email or [Instagram (@blick_elements)](https://instagram.com/blick_elements).
