---
layout: single
title: "Typewriter Collection"
permalink: /collections/typewriters/
description: A running list of the antique and vintage typewriters in my collection.
author_profile: false
---

{{ site.data.typewriters | size }} machines, spanning an 1890 Hammond Model 1 to mid-century portables. Some entries are missing a year, serial number, or typeface simply because I haven't logged that detail yet — this list reflects what I've catalogued so far, not the full extent of what I own. See [3D-Printed Type Elements](/projects/type-elements/) for the replacement parts I've designed for several of these.

Restoring these machines — cleaning, repairing, and adjusting decades-old mechanisms back to working order — turns out to double as a genuinely effective way to unwind from engineering coursework: focused, hands-on, and close to a flow state. It was enough of a pattern that it became the subject of a class presentation on stress-reduction techniques.

Part of the wider [collections](/collections/).

<!-- FEATURED MACHINES: restore this heading once the first photo below is uncommented — an empty heading with no photos under it renders as a blank gap.
## Featured Machines
-->

<!-- PHOTO NEEDED: the 1890 Hammond Model 1 — the oldest machine in the collection.
Save as assets/img/2026/typewriter-collection/hammond-model-1.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/typewriter-collection/hammond-model-1.jpg" alt="1890 Hammond Model 1" caption="1890 Hammond Model 1 — the oldest machine in the collection." %}
-->

<!-- PHOTO NEEDED: Blickensderfer No. 5 — ties directly to the Type-Elements Blickensderfer typewheel project.
Save as assets/img/2026/typewriter-collection/blickensderfer-no5.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/typewriter-collection/blickensderfer-no5.jpg" alt="Blickensderfer No. 5" caption="Blickensderfer No. 5, fitted with a resin-printed replacement typewheel." %}
-->

<!-- PHOTO NEEDED: a Hammond Multiplex, ideally with its (conventional, one-piece) shuttle visible/removed.
Save as assets/img/2026/typewriter-collection/hammond-multiplex.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/typewriter-collection/hammond-multiplex.jpg" alt="Hammond Multiplex" caption="Hammond Multiplex, with its swappable shuttle." %}
-->

<!-- PHOTO NEEDED: the IBM Selectric II.
Save as assets/img/2026/typewriter-collection/ibm-selectric-ii.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/typewriter-collection/ibm-selectric-ii.jpg" alt="IBM Selectric II" caption="IBM Selectric II." %}
-->

## Full Inventory

Model names in **bold link** to a page about that machine. Not every machine has one — I write them up as I get round to it.

{% include collection-table.html
   items=site.data.typewriters
   alt_keys="manufacturer,model"
   link_docs=site.typewriters
   link_data_key="serial_number"
   link_doc_key="serial"
   link_column="model"
   columns="year:Year,manufacturer:Manufacturer,model:Model,body_size:Size,drive:Drive,color:Color,serial_number:Serial No.,typeface:Typeface,layout:Layout,pitch:Pitch" %}
