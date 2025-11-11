---
layout: page
title: Bennett Type Elements
description: 3D-printed replacement type elements for Bennett Pocket Typewriters, restoring functionality to machines with damaged or lost original vulcanized rubber elements
img: assets/img/12.jpg
importance: 1
category: 3d type elements
---

## Overview

I developed 3D-printed replacement type elements for the Bennett Pocket Typewriter using OpenSCAD and high-precision resin 3D printing. This project was born from my acquisition of a Bennett Pocket Typewriter with the specific desire to recreate the type elements, as the original vulcanized rubber type elements are frequently lost or damaged due to their unique design and construction. The resulting 3D-printed elements work great—almost better than the original vulcanized rubber ones—restoring life and the ability to use the machine without fear of damage.

## Development History

This was the third type element project I created, following my work on Blickensderfer typewheels and IBM Selectric type elements. The Bennett Pocket Typewriter presented a unique challenge that required a different approach from my previous projects.

I acquired a Bennett Pocket Typewriter specifically with the goal of recreating its type elements. The OpenSCAD code went through many iterations to obtain the correct geometry. Each iteration required careful refinement of the parametric design to match the mechanical requirements and character geometry of the original type elements.

The iterative development process was essential because the Bennett's type elements have a unique construction that differs significantly from both the Blickensderfer typewheels and IBM Selectric balls. Getting the geometry right required extensive testing and refinement, but the final result exceeded expectations.

## The Challenge

Bennett Pocket Typewriters (manufactured around 1910) use type elements made from vulcanized rubber that are particularly fragile due to their design and construction. These original type elements are frequently lost or damaged, making it difficult or impossible to use these historic machines. Creating precise replacements requires:

- Extremely fine detail resolution for small type characters
- Accurate mechanical geometry to interface with the Bennett's unique typewriter mechanism
- Understanding of the original vulcanized rubber element construction and its limitations
- Precision alignment for proper character registration
- Durability improvements over the original material

The original vulcanized rubber elements, while functional when new, deteriorate over time and are prone to damage from normal use. This fragility has made many Bennett Pocket Typewriters unusable, as replacement elements are extremely rare and often in poor condition.

## The Solution

After many iterations of OpenSCAD code to achieve the correct geometry, I developed type elements using high-precision resin 3D printing that:

- Match the mechanical specifications of original Bennett Pocket Typewriter type elements
- Feature improved durability compared to the original vulcanized rubber elements
- Work great—almost better than the original vulcanized rubber ones
- Restore full functionality to machines that would otherwise be unusable
- Enable confident use of the machine without fear of damage to the type elements

The parametric OpenSCAD approach allowed for precise control over the geometry, enabling me to refine the design through multiple iterations until the elements functioned perfectly. The 3D-printed resin elements not only restore functionality but also provide improved reliability compared to the original materials.

## Technical Details

- **Design Software:** OpenSCAD (parametric modeling with many iterations)
- **Manufacturing:** High-precision resin 3D printing
- **Development Process:** Extensive iterative refinement to achieve correct geometry
- **Compatibility:** Bennett Pocket Typewriter
- **Key Improvements:** Enhanced durability and performance over original vulcanized rubber elements

### Related Typewriters

View my Bennett Pocket Typewriters in my [typewriter collection]({{ '/typewriter-collection/' | relative_url }}):
{% assign bennetts = site.data.typewriters | where: "manufacturer", "Bennett" %}
{% for tw in bennetts %}
- [{{ tw.year }} {{ tw.manufacturer }} {{ tw.model }}{% if tw.serial_number %} (Serial: {{ tw.serial_number }}){% endif %}]({% if tw.blog_post %}{{ tw.blog_post | relative_url }}{% else %}{{ '/typewriters/' | append: tw.slug | append: '/' | relative_url }}{% endif %})
{% endfor %}

## Impact

This project demonstrates how modern 3D printing technology can restore functionality to antique typewriters that have become unusable due to the loss or damage of critical components. By creating durable replacement type elements that perform as well as—or better than—the originals, this work enables collectors and enthusiasts to confidently use Bennett Pocket Typewriters without fear of damaging irreplaceable parts.

The iterative development process, while challenging, resulted in a solution that not only restores these machines to working condition but also improves upon the original design in terms of durability and reliability. This restoration work brings new life to machines that might otherwise remain as display pieces, unable to fulfill their intended purpose.

## Contact

For inquiries about custom Bennett type elements or collaboration opportunities, contact me via email or social media.

