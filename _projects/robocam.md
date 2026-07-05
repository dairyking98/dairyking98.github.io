---
layout: single
title: RoboCam
description: A 3D-printer-based robotic imaging platform, with FluorCam (fluorescence microscopy) and StentorCam (behavioral dark-field imaging) as its two research applications.
header:
  teaser: /assets/img/12.jpg
importance: 1
category: school-project
github: https://github.com/dairyking98/RoboCam3.1
---

RoboCam is a robotic imaging platform that repurposes a 3D printer as a precision XY(Z) positioning stage for camera hardware, turning it into an automated microscopy/imaging system. **FluorCam** and **StentorCam** are both applications built on top of this same platform, not separate systems — FluorCam adapts it for fluorescence microscopy, and StentorCam adapts it for behavioral dark-field imaging of *Stentor coeruleus*.

## Platform Overview

- **Motion Control**: 3D printer (Marlin/Klipper) driven over serial/G-code for precise, repeatable positioning
- **Imaging**: Raspberry Pi camera, Player One astronomy camera, or USB webcam, depending on the build
- **Illumination**: GPIO-controlled laser/IR for stimulation and dark-field contrast
- **Calibration**: 4-corner calibration with bilinear interpolation for accurate well-plate positioning
- **Automation**: GUI and CLI tools for calibration, alignment preview, and scripted experiment execution

## FluorCam {#fluorcam}

FluorCam is a low-cost, open-source fluorescence and IR dark-field microscope built on RoboCam — achieving imaging comparable to commercial fluorescence microscopes at roughly **$500** versus $20,000+ for commercial systems. It adds coaxial optics and excitation/emission filters, plus custom 3D-printed mounts for optical alignment.

This work has been presented at the Gilead Scholars Research Program Symposium, the Student Enrichment Office Annual Research Symposium, and the Center for Cellular Construction Summer Retreat, and was supported by a Gilead Innovation Initiative Summer Internship Award.

## StentorCam {#stentorcam}

StentorCam adapts RoboCam for well-plate behavioral imaging of *Stentor coeruleus*, adding well-plate motion profiles, dark-field optics with infrared illumination, and automated tracking/stimulation experiments. It has been used in NSF-funded training programs and team research projects for high-throughput biological imaging.

## Origins & Version History

RoboCam builds on prior work in the same lab and open-source community rather than starting from scratch — each rebuild below happened for a specific reason, not just for its own sake:

1. **[FlyCam](https://github.com/E-Lab-SFSU/FlyCam)** (Esquerra Lab, SFSU) — the original 3D-printer-as-imaging-stage concept that inspired this platform, and the earliest of everything here. Its GUI was originally built on PySimpleGUI, later migrated to the FreeSimpleGUI fork after PySimpleGUI's license changed to a paid/restricted model — the same licensing shift is why every project below built its GUI on Tkinter (and later PySide6) instead.
2. **[screamuch/RoboCam](https://github.com/screamuch/RoboCam)** — the base RoboCam implementation this project's suite was built on. Development continued here rather than on the original repo because that repo's author was no longer around to keep working on it.
3. **[RoboCam-Suite](https://github.com/dairyking98/RoboCam-Suite)** — the first working suite built from that base: a Tkinter GUI, Raspberry Pi + Picamera2 imaging, GPIO laser control, and calibrate/preview/experiment applications. It was designed to generalize across different devices and experiments, but in practice was only built out with StentorCam in mind. Partway through, Player One monochrome astrophotography camera support was added alongside Picamera2 — the Raspberry Pi camera's monochrome sensitivity wasn't good enough for the imaging this needed, so a dedicated monochrome astro camera was brought in, accepting slower USB-based capture as the tradeoff.
4. **[RoboCam-Suite2.0](https://github.com/dairyking98/RoboCam-Suite2.0)** — a complete modular rewrite: cross-platform (Windows/macOS/Linux), moved off Tkinter to a PySide6 GUI, pluggable camera/motion drivers (carrying Player One, Picamera2, and OpenCV forward), and full hardware simulation mode.
5. **[RoboCam3.1](https://github.com/dairyking98/RoboCam3.1)** (current) — a clean rewrite on top of 2.0's foundation: a fresh GUI implementation, expanded camera support, and Klipper support — driving the laser/stimulus output through the 3D printer's own control board via G-code instead of Raspberry Pi GPIO, ahead of hardware built around Klipper controllers rather than Marlin-only boards. Also adds dual motion backends, burst-mode capture, and a post-processing pipeline for converting raw sensor data into frames and video.

## Repository

The current, actively developed version is [RoboCam3.1](https://github.com/dairyking98/RoboCam3.1). Earlier stages of the project are preserved in [RoboCam-Suite2.0](https://github.com/dairyking98/RoboCam-Suite2.0) and [RoboCam-Suite](https://github.com/dairyking98/RoboCam-Suite).
