---
layout: post
title: Building HPWriter - A Silent Digital Typewriter
date: 2025-11-20 10:00:00
description: Why I'm building HPWriter, a silent digital typewriter that prints on plain paper, and what inspired this project.
tags: hpwriter typewriter electronics engineering projects
categories: Projects
thumbnail: /assets/img/9.jpg
---

I've been working on a project called **HPWriter**—a silent digital typewriter that prints on plain paper using an HP45 inkjet cartridge. It's been one of those projects that started from a simple observation and grew into something I'm genuinely excited about building.

## The Problem That Started It All

The inspiration for HPWriter came from a very specific frustration: I love typewriters, but they're loud. Really loud. And while that satisfying *clack-clack-clack* is part of the charm when you're typing at home, it becomes a problem in shared spaces—classrooms, libraries, coffee shops, anywhere you want to focus but don't want to disturb everyone around you.

There are quieter alternatives—thermal paper typewriters exist, and they're much quieter than mechanical typewriters. But they come with significant drawbacks: the paper can be hard to find, it's temperature-sensitive (text can fade or darken with heat), and most concerningly, thermal paper often contains BPA and other chemicals that can be toxic. Plus, thermal paper typewriters are outdated technology, built on systems that are no longer in active development.

There's also the Freewrite, a digital silent typewriter that offers distraction-free writing. But it doesn't produce paper output—everything stays digital. For me, there's something important about having physical output you can hold, file away, or share without needing a device to read it.

At the same time, I've noticed how distracting modern devices can be. When I see students in class with laptops or iPads, they're often pulled away by notifications, apps, and the endless possibilities of the internet. There's something to be said for a device that does one thing well: lets you write, without distractions, and produces real output you can hold in your hands.

## What I Wanted to Build

I wanted to create something that combined the best of both worlds:

- **The focus of a typewriter** - No operating system, no apps, no notifications. Just you and your words.
- **The silence of modern electronics** - Quiet enough to use anywhere without bothering others.
- **Real ink on paper** - Not a screen, not thermal paper, but actual ink on standard paper that will last.
- **The simplicity of an appliance** - Instant boot, no setup, just plug in a keyboard and start typing.

HPWriter is my attempt to build exactly that.

## Why HP45 Inkjet?

The choice to use an HP45 inkjet cartridge might seem unusual, but it's actually perfect for this application. HP45 cartridges are:

- **Readily available** - You can find them anywhere, and they're relatively inexpensive.
- **Refillable** - HP45 cartridges can be refilled, which reduces waste and long-term costs, aligning with the serviceable design philosophy.
- **High quality** - They produce crisp, permanent text on standard paper.
- **Well-documented** - There's existing work on controlling these cartridges, which makes the engineering challenge more approachable.
- **Compact** - The cartridge is small enough to fit in a portable device.
- **Uses standard paper** - Unlike thermal paper typewriters, HPWriter uses plain paper that's easy to find, won't fade with temperature, and doesn't contain toxic chemicals.

The technical challenge of generating the microsecond firing pulses needed to control the inkjet nozzles is interesting, but it's a solvable problem with modern microcontrollers.

## The Design Philosophy

From the beginning, I've been thinking about HPWriter as a long-lived, serviceable device. I'm using:

- **ESP32-S3 microcontroller** - Modern, capable, and well-supported.
- **NEMA-14 stepper motors with TMC drivers** - Quiet, precise motion control.
- **Modular design** - Components that can be replaced or upgraded.
- **Open-source everything** - All the code, schematics, and documentation will be available.

This isn't meant to be a disposable gadget. I want something that could last for years, that you could repair yourself, and that would become a reliable tool for focused writing.

## Where This Fits

I see HPWriter being useful in several scenarios:

- **Classrooms and libraries** - Silent enough to use without disturbing others.
- **Focus writing sessions** - No internet means no distractions.
- **Journaling and personal writing** - Physical output provides a tangible record.
- **Field research** - Battery-powered portability for on-site note-taking.
- **Creative writing** - A dedicated device for deep work.

It's not trying to replace laptops or tablets—it's trying to fill a specific niche where you want to write, you want physical output, and you want to do it quietly and without distractions.

## The Journey So Far

Building HPWriter has been a learning experience. I've had to dive deep into:

- Inkjet cartridge control and timing
- Stepper motor control and quiet operation
- USB keyboard and flash drive interfacing
- Text editing and print buffer management
- Mechanical design for paper handling

Each piece has its own challenges, but that's part of what makes the project interesting. It's at the intersection of mechanical engineering, electronics, and software—exactly the kind of work I love doing.

## What's Next

The project is still very much in development. I'm working through the mechanical design, refining the electronics, and building out the software. The [HPWriter repository](https://github.com/dairyking98/HPWriter) has all the current work, and I'm documenting the process as I go.

I'm excited to see where this goes. There's something appealing about building a tool that does one thing really well, and I think HPWriter has the potential to be exactly that—a silent, focused writing device that produces real, tangible output.

If you're interested in following along, check out the [project page](/projects/) or the [GitHub repository](https://github.com/dairyking98/HPWriter). I'll be sharing updates as the project progresses.

