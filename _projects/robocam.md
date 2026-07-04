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

RoboCam builds on prior work in the same lab and open-source community rather than starting from scratch:

1. **[FlyCam](https://github.com/E-Lab-SFSU/FlyCam)** (Esquerra Lab, SFSU) — the original 3D-printer-as-imaging-stage concept that inspired this platform.
2. **[screamuch/RoboCam](https://github.com/screamuch/RoboCam)** — the base RoboCam implementation this project's suite was built on.
3. **[RoboCam-Suite](https://github.com/dairyking98/RoboCam-Suite)** — the first full working suite built from that base: Raspberry Pi + Picamera2, GPIO laser control, and calibrate/preview/experiment applications supporting RoboCam, FluorCam, and StentorCam.
4. **[RoboCam-Suite2.0](https://github.com/dairyking98/RoboCam-Suite2.0)** — a complete modular rewrite: cross-platform (Windows/macOS/Linux), a PySide6 GUI, pluggable camera/motion drivers, and full hardware simulation mode.
5. **[RoboCam3.1](https://github.com/dairyking98/RoboCam3.1)** (current) — the most advanced version: a six-tab PySide6 application with dual motion backends (Marlin and Klipper), multi-camera support, burst-mode capture, and a post-processing pipeline for converting raw sensor data into frames and video.

## Repository

The current, actively developed version is [RoboCam3.1](https://github.com/dairyking98/RoboCam3.1). Earlier stages of the project are preserved in [RoboCam-Suite2.0](https://github.com/dairyking98/RoboCam-Suite2.0) and [RoboCam-Suite](https://github.com/dairyking98/RoboCam-Suite).
