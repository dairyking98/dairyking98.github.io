---
layout: page
title: IBM Selectric Type Elements
description: Parametric 3D-printed replacement type elements for IBM Selectric typewriters, with support for any keyboard layout, font, and key arrangement
img: assets/img/12.jpg
importance: 1
category: 3d type elements
---

## Overview

I developed a fully parametric OpenSCAD system for creating 3D-printed type elements for IBM Selectric typewriters. This project began with initial prototypes in Fusion360, was temporarily abandoned, and then reignited through collaboration with a collector in Finland who owns a rare IBM Selectric Composer. The final system can generate STL files for any keyboard layout, any font, and any key arrangement.

## Development History

### Initial Prototype (Fusion360)

The IBM Selectric was the second type element I attempted to create, following my work on Blickensderfer typewheels. I initially modeled the first prototype in Fusion360 and printed out some of my own prototypes to validate the concept.

### Temporary Abandonment

After the release of another project that involved OpenSCAD type elements for the Selectric, I abandoned the pursuit of creating my own OpenSCAD model, assuming the problem had been solved by others.

### Reignition: The IBM Selectric Composer

My friend and collector in Finland obtained a rare **IBM Selectric Composer**, which was a far more advanced version of the IBM Selectric that could produce proportional and justified type. This unique machine reignited my drive to create performant type elements specifically for his machine.

### Iterative Development: Remote Collaboration Across Continents

This project represents a unique challenge in distributed design and manufacturing. Working with my friend and collector in Finland, we established an iterative development process that spanned thousands of miles. I designed the type elements in OpenSCAD and generated STL files, which I would send to Finland. My friend would then print the iterations on his resin printer, test them in his IBM Selectric Composer, and provide feedback with photos and detailed observations.

This remote collaboration required careful communication and trust, as I didn't have direct access to:
- The resin printer for immediate testing
- The actual IBM Selectric Composer machine
- The ability to physically inspect prints or test fitment

Despite these limitations, we were able to dial in the design through multiple iterations. Each cycle involved:
1. **Design refinement** - I would modify the OpenSCAD parameters based on feedback
2. **STL generation** - Creating new files to send overseas
3. **Remote printing** - My friend would print and test in Finland
4. **Feedback loop** - Detailed reports on fitment, character quality, and mechanical performance

This process demonstrated that modern parametric design tools and digital fabrication can enable effective collaboration even when physical resources are distributed across continents. The design was carefully tuned to work with the Selectric Composer's more advanced proportional type system, all while working remotely without direct access to the machine or printing equipment.

### Adaptation for Standard Selectric

Once the design was dialed in for the Selectric Composer, I adapted it for regular IBM Selectric elements, making the system versatile enough to work with both the standard Selectric and its more advanced Composer variant.

## The Challenge

IBM Selectric typewriters (introduced in 1961) use spherical type elements that rotate and tilt to position characters. Creating precise replacements requires:

- Extremely fine detail resolution for character definition
- Accurate mechanical geometry to interface with the Selectric's ball mechanism
- Support for the unique spherical mounting system
- Compatibility with various keyboard layouts and key arrangements
- For Selectric Composer: Support for proportional spacing and justified text capabilities

## The Solution

The final OpenSCAD system is fully parametric and can:

- **Accept any keyboard layout** - QWERTY, Dvorak, AZERTY, or custom layouts
- **Work with any font** - Any TrueType or OpenType font can be used as input
- **Support any key arrangement** - Flexible mapping between keys and characters
- **Generate STL files** - Direct output ready for 3D printing
- **Support both standard Selectric and Selectric Composer** - Adapted for both proportional and monospaced type systems

This parametric approach means that creating a new type element is as simple as specifying the font, keyboard layout, and key-to-character mapping—the system handles all the geometric calculations and generates a printable STL file.

## Technical Details

- **Design Software:** OpenSCAD (fully parametric modeling)
- **Initial Prototyping:** Fusion360 (first prototype)
- **Manufacturing:** High-precision resin 3D printing
- **Collaboration Model:** Remote iterative development with collector in Finland
  - Design and STL generation performed remotely
  - Printing and testing conducted in Finland
  - Iterative refinement through transcontinental feedback loops
- **Compatibility:** IBM Selectric and IBM Selectric Composer
- **Key Features:**
  - Parametric design accepts any keyboard layout
  - Supports any font as input
  - Flexible key arrangement mapping
  - Direct STL output for 3D printing

### Related Typewriters

View my IBM Selectric typewriters in my [typewriter collection]({{ '/typewriter-collection/' | relative_url }}):
{% assign ibm_selectrics = site.data.typewriters | where_exp: "tw", "tw.model contains 'Selectric'" %}
{% for tw in ibm_selectrics %}
- [{{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}]({% if tw.blog_post %}{{ tw.blog_post | relative_url }}{% else %}{{ '/typewriters/' | append: tw.slug | append: '/' | relative_url }}{% endif %})
{% endfor %}

## Impact

This project demonstrates the power of parametric design in creating flexible solutions for antique typewriter restoration. By developing a system that can adapt to any keyboard layout, font, and key arrangement, the project enables collectors to create custom type elements that were never available from the original manufacturer, while also supporting rare variants like the Selectric Composer that require specialized type elements.

The remote collaboration aspect of this project also highlights how modern digital design and manufacturing tools enable distributed development workflows. By leveraging parametric design and digital file sharing, we were able to successfully iterate on a precision mechanical component despite being separated by thousands of miles and not having direct access to the target machine or manufacturing equipment. This approach opens possibilities for collaborative restoration projects where expertise, machines, and equipment are distributed across different locations.

## Contact

For inquiries about custom IBM Selectric type elements or collaboration opportunities, contact me via email or social media.

