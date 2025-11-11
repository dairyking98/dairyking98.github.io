---
layout: page
title: Blickensderfer Typewheels
description: Brand-new 3D-printed replacement type elements for antique Blickensderfer typewriters, featuring typefaces never before available for these machines
img: assets/img/12.jpg
importance: 1
category: 3d type elements
---

## Overview

I collaborated with Brent Carter to design and manufacture brand-new, interchangeable typewheels for Blickensderfer typewriters using precision 3D printing technology. This project brings new life to machines that have been "obsolete" for nearly a century, creating replacement parts that are not only functional but also introduce typefaces never before available for these historic machines.

## Development History

This was the first type element I ever attempted to create. My initial prototypes were designed in Fusion 360, where the primary challenge was creating the tapered extrusion—or draft angle—of the characters while maintaining parametricity. To validate the concept, I outsourced 3D prints to a local resin printing company in the Bay Area.

The first prototype proved to be more functional than I initially thought, demonstrating that the concept was viable. You can see the first prototype in action in [this video on my YouTube channel](https://www.youtube.com/watch?v=fJSAW26kJwg).

After validating the concept with outsourced prints, I invested in my own resin 3D printer and began printing and testing my own prototypes. This transition to in-house printing allowed for faster iteration cycles and more control over the printing process.

I soon discovered OpenSCAD, which helped overcome the parametricity and draft angle modeling challenges that were difficult in Fusion 360. Learning OpenSCAD opened a whole new door for me, enabling true parametric design with precise control over the character geometry and draft angles needed for functional type elements.

## The Challenge

Blickensderfer typewriters (manufactured from 1894-1919) feature interchangeable typewheels, but original typewheels are rare, often damaged, and limited to the fonts available during production. Creating precise replacements requires:

- Extremely fine detail resolution (no pixelation on small type characters)
- Accurate mechanical geometry to interface with the typewriter mechanism
- Compatibility with both DHIATENSOR (Scientific) and QWERTY keyboard layouts
- Precision alignment for proper character registration

## The Solution

After initial prototyping in Fusion 360 and transitioning to OpenSCAD for parametric design, I developed typewheels using high-precision resin 3D printing that:

- Match the mechanical specifications of original Blickensderfer typewheels
- Feature typefaces never before available for these machines, including:
  - **Steile Zierschrift** (decorative type)
  - **Goudy italic** (designed by Frederic Goudy)
  - Script and Vogue typefaces
- Are available in both DHIATENSOR and QWERTY layouts
- Come packaged in custom containers with screw-on tops
- Achieve the most precise 3D printing quality—no pixelation on fine shapes

## Recognition

This work was [featured on Typewriter Revolution](https://typewriterrevolution.com/new-typewheels-for-the-blickensderfer-typewriter/), a leading resource for typewriter enthusiasts and collectors. The article highlights how this collaboration represents "a revolution in retro writing technology," bringing modern manufacturing techniques to preserve and enhance historic machines.

## Technical Details

- **Design Software:** OpenSCAD (parametric modeling) - evolved from initial Fusion 360 prototypes
- **Manufacturing:** High-precision resin 3D printing (initially outsourced to Bay Area resin printing company, now in-house)
- **Font Design & Digitization:** Brent Carter (font design, digitization, fine tuning, and adjustment)
- **Testing & Iteration:** Brent Carter (testing printed iterations and performing fine tuning)
- **3D Printing & Engineering:** Leonard Chau
- **Compatibility:** Blickensderfer models 5, 6, 7, 8, 9, and Home Blick
- **Layouts Available:** DHIATENSOR (Scientific) and QWERTY

### Related Typewriters

View my Blickensderfer typewriters in my [typewriter collection]({{ '/typewriter-collection/' | relative_url }}):
{% assign blickensderfers = site.data.typewriters | where: "manufacturer", "Blickensderfer" %}
{% for tw in blickensderfers %}
- [{{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}]({% if tw.blog_post %}{{ tw.blog_post | relative_url }}{% else %}{{ '/typewriters/' | append: tw.slug | append: '/' | relative_url }}{% endif %})
{% endfor %}

## Impact

This project demonstrates how modern digital fabrication can preserve and enhance historical technology. By creating precise, functional replacements and introducing new typefaces, we're enabling collectors and enthusiasts to use these machines in ways that weren't possible when they were originally manufactured.

## Contact

For inquiries about custom typewheels or collaboration opportunities, contact me via email, [Instagram (@blick_elements)](https://instagram.com/blick_elements), or Facebook.

