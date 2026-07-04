---
layout: single
title: "Typewriter Collection"
permalink: /typewriter-collection/
description: A running list of the antique and vintage typewriters in my collection.
author_profile: true
---

{{ site.data.typewriters.size }} machines, spanning an 1890 Hammond Model 1 to mid-century portables. Some entries are missing a year, serial number, or typeface simply because I haven't logged that detail yet — this list reflects what I've catalogued so far, not the full extent of what I own. See [3D-Printed Type Elements](/projects/type-elements/) for the replacement parts I've designed for several of these.

<div style="overflow-x: auto;" markdown="1">

| Year | Manufacturer | Model | Size | Drive | Color | Serial No. | Typeface | Layout / Pitch |
|---|---|---|---|---|---|---|---|---|
{% for tw in site.data.typewriters -%}
| {{ tw.year | default: "—" }} | {{ tw.manufacturer }} | {{ tw.model | default: "—" }} | {{ tw.size | default: "—" }} | {{ tw.drive | default: "—" }} | {{ tw.color | default: "—" }} | {{ tw.serial_number | default: "—" }} | {{ tw.typeface | default: "—" }} | {{ tw.layout | default: tw.pitch | default: "—" }} |
{% endfor %}

</div>
