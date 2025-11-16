---
layout: page
title: HPWriter - Silent Digital Typewriter
description: A modern, silent typewriter that prints on plain paper using an HP45 inkjet cartridge. Features instant boot, USB keyboard input, USB flash drive support, and ultra-quiet operation.
img:
importance: 1
category: personal-project
github: https://github.com/dairyking98/HPWriter
---

A modern, silent typewriter that prints on plain paper using an HP45 inkjet cartridge. This project explores a practical "digital typewriter" that behaves like a real appliance — no operating system, no laptop required.

## Project Overview

HPWriter is designed to solve the problem of noisy, distracting typewriters in classroom settings, while providing a distraction-free writing experience that produces real ink-on-paper output.

## Key Features

- **Instant boot** (ESP32-S3 microcontroller)
- **USB keyboard input** for typing
- **USB flash drive support** (save / load text files)
- **Plain text editor + print buffer**
- **Real ink-on-paper**, not thermal
- **Ultra-quiet motion** (NEMA-14 steppers + TMC drivers)
- **Dedicated HP45 inkjet controller** for microsecond firing pulses
- **Portable, battery powered**
- **Serviceable and long-lived** design philosophy

## Motivation

Traditional analog typewriters are too noisy and distracting for classroom use, while iPads and laptops can be distracting for both students and teachers. HPWriter provides a silent, distraction-free, battery-powered typewriter with keyboard input for students who want to type in class without the noise distraction.

## Technical Specifications

- **Print Resolution**: 300 DPI equivalent (HP45 native resolution)
- **Character Spacing**: 10 CPI or 12 CPI (user-selectable)
- **Line Spacing**: 6 LPI or 8 LPI (user-selectable)
- **Paper**: Standard plain paper (20–24 lb bond recommended)
- **Ink**: HP45 compatible ink cartridges
- **Control**: ESP32-S3 microcontroller
- **Motion Control**: NEMA-14 steppers with TMC drivers

## Where This Device Excels

- **Libraries and quiet spaces**: Silent operation allows typing without disturbing others
- **Focus writing sessions**: No internet, notifications, or apps to distract
- **Journaling and personal writing**: Physical output provides a tangible record
- **Field research and note-taking**: Battery-powered portability for on-site documentation
- **Creative writing retreats**: Distraction-free environment for deep work

## Advantages Over Existing Solutions

Unlike digital-only typewriters (Freewrite Smart, Alpha Typewriter) or older thermal paper machines, HPWriter offers:

- ✅ Real ink on paper (non-toxic, standard paper)
- ✅ Modern, open-source design
- ✅ File export capability
- ✅ Multiple modes and programs
- ✅ Interactive CLI interface
- ✅ Serviceable and long-lived design

## Repository

The complete source code, documentation, bill of materials, and project plans are available in the [HPWriter repository](https://github.com/dairyking98/HPWriter).
