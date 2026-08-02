---
layout: single
title: RoboCam
description: A 3D-printer-based robotic imaging platform, with FluorCam (fluorescence microscopy) and StentorCam (behavioral dark-field imaging) as its two research applications.
# PHOTO NEEDED: hero shot of the full rig on the printer bed, well-plate loaded, ideally with the laser lit.
# Save as assets/img/2026/robocam/hero.jpg, then set header.teaser (and header.image) to it. See PHOTOS_NEEDED.md.
header:
  teaser: /assets/img/12.jpg
importance: 1
category: school-project
github: https://github.com/dairyking98/RoboCam3.1
toc: true
toc_label: "Contents"
toc_sticky: true
---

RoboCam is a robotic imaging platform that repurposes a 3D printer as a precision XY(Z) positioning stage for camera hardware, turning it into an automated microscopy/imaging system. **FluorCam** and **StentorCam** are both applications built on top of this same platform, not separate systems — FluorCam adapts it for fluorescence microscopy, and StentorCam adapts it for behavioral dark-field imaging of *Stentor coeruleus*.

<div class="notice--info">
  <strong>Official documentation:</strong> RoboCam3.1 is developed in the Esquerra Lab (E-Lab) at SFSU, with collaborators at UC Santa Cruz and Knox College through the Center for Cellular Construction. The lab keeps a full documentation site at
  <a href="https://e-lab-sfsu.github.io/RoboCam3.1/">e-lab-sfsu.github.io/RoboCam3.1</a> &mdash; feature list, hardware BOM and assembly steps, a real-capture gallery, roadmap/known issues, and full team credits &mdash; alongside the
  <a href="https://github.com/E-Lab-SFSU/RoboCam3.1">E-Lab-SFSU/RoboCam3.1</a> repo. What's below is my own write-up of the platform and my role building it; the lab site is the actively-maintained group reference for the rest of the team and anyone looking to build one.
</div>

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

## Recent Development {#recent-development}

RoboCam3.1 has moved fast since it was first written up here. Highlights from the last several dozen commits:

**GUI & workflow**
- A dedicated **Motion Profiles tab** for tuning Marlin feed-rate, acceleration, and jerk directly from the GUI instead of hand-editing firmware config
- **Demo Mode**: a fullscreen preview with keyboard-shortcut well navigation and laser control, for showing the rig off without touching the full calibration/experiment workflow
- A **well crosshair overlay** on the live camera preview, plus Setup-panel state (camera, connection, layout) now persists and reloads across sessions
- **ETA accuracy and auto-homing safety** fixes for the Experiment tab, plus verbose Setup-panel logging during Marlin connect
- **Exposure and Target FPS decoupled** in the Calibration tab — target FPS now snaps to what's actually achievable after exposure changes, instead of silently drifting

**Camera & capture**
- **Multi-camera selection**: the Setup panel enumerates every connected Pi camera by model/index, and PlayerOne cameras blocked by USB permissions get an in-app udev-rule installer instead of a silent failure
- The **raw-burst capture path was rebuilt for real throughput**: acquisition and disk-writing now run on separate threads connected by a bounded queue, so encoding/disk I/O can never stall the capture loop — every frame is still guaranteed written, even on `stop()`
- The Pi camera path now opens a genuine **video+raw stream configuration**, so `get_raw_frame()` returns true 10/12-bit Bayer sensor data instead of ISP-processed greyscale

**Klipper support**
- Motion and laser/stimulus control can now run through a **Klipper-based printer controller** via G-code (`SET_PIN`) as an alternative to wiring a dedicated Raspberry Pi GPIO output — aimed at newer hardware builds using Klipper controllers instead of Marlin-only boards. (Implemented, not yet exercised against real Klipper hardware — see Known Issues in `docs/recording_modes.md`.)

**Processing pipeline**
- A new **Processing tab** batch-converts raw `.npy` bursts into PNG/JPEG image sequences and video (constant-fps MP4 for presentation, VFR MKV with accurate per-frame timing for archival), with an **auto-process after experiment** option that kicks off the moment a run finishes

**Hardware**
- Compute moved from a Raspberry Pi 4 + microSD to a **Raspberry Pi 5 with an M.2 HAT+ and 512GB NVMe SSD**, for faster, higher-capacity raw-burst capture
- A **Player One Uranus M** camera is under evaluation as an alternative to the Mars 662M
- Dark-field mask geometry is now documented as three tuned parameters — mask stop diameter, well height above the mask, and mask thickness — rather than fixed dimensions; see the [hardware page](https://e-lab-sfsu.github.io/RoboCam3.1/hardware.html) for the full writeup

## Hardware {#hardware}

RoboCam repurposes a stock FDM 3D printer's XY(Z) motion system as a precision positioning stage — the print head is replaced with a camera/illumination carriage, and the bed becomes the imaging stage for well plates or samples.

Full bill of materials, assembly steps, and hardware photos (rig overview, optics mount, camera options) are on the [official hardware page](https://e-lab-sfsu.github.io/RoboCam3.1/hardware.html).

<!-- PHOTO NEEDED: full rig on the printer bed, well-plate loaded.
Save as assets/img/2026/robocam/rig-overview.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/robocam/rig-overview.jpg" alt="RoboCam rig on the 3D printer bed" caption="RoboCam's camera/illumination carriage mounted on the printer's XY(Z) stage." %}
-->

<!-- PHOTO NEEDED: close-up of the laser/IR illumination and optics mount.
Save as assets/img/2026/robocam/optics-mount.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/robocam/optics-mount.jpg" alt="RoboCam laser and optics mount" caption="GPIO/Klipper-controlled laser and dark-field optics mount, 3D-printed." %}
-->

<!-- PHOTO NEEDED: side-by-side or swap shot of the two camera options (Player One astro camera vs. Raspberry Pi camera module).
Save as assets/img/2026/robocam/camera-comparison.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/robocam/camera-comparison.jpg" alt="PlayerOne and Raspberry Pi camera options" caption="Interchangeable imaging heads: PlayerOne monochrome astronomy camera vs. Raspberry Pi camera module." %}
-->

## Experimental Data {#experimental-data}

Every experiment captures **raw sensor bursts** rather than encoded video — frames are written as fast as possible with per-frame timestamps (`time.perf_counter()`), and video/images are produced afterward in a separate post-processing step. That keeps the time-critical capture loop free of encoding overhead and preserves full sensor bit depth for downstream analysis. Captures are stacked into one memory-mapped `.npy` array per well plus a JSON sidecar of per-frame timing and laser events, then converted by the Processing tab into PNG/JPEG stacks, a presentation MP4, and/or a lossless VFR MKV for archival.

Real measurement from a 3-well capture (Mars 662M mono, 8-bit, 1280×960, 908 frames, 2026-07-29) shows how the export formats compare against the raw data:

| Format | Total size | % of raw | Lossless? |
|---|---|---|---|
| Raw `.npy` | 1,064.0 MiB | 100% | — |
| PNG stack | 743.6 MiB | 69.9% | Yes |
| VFR (ffv1) | 673.6 MiB | 63.3% | Yes |
| JPEG stack (q95) | 469.8 MiB | 44.2% | No |
| MP4 (libx264, presentation) | 225.9 MiB | 21.2% | No |

Real capture examples — a dark-field well plate under baseline and green-laser-stimulus conditions, plus the resulting *Stentor* swimming-speed traces — are in the [gallery](https://e-lab-sfsu.github.io/RoboCam3.1/gallery.html).

<!-- PHOTO NEEDED: a representative captured frame or plate montage from a real experiment (StentorCam dark-field well or FluorCam fluorescence shot).
Save as assets/img/2026/robocam/sample-capture.jpg, then uncomment:
{% include figure image_path="/assets/img/2026/robocam/sample-capture.jpg" alt="Sample RoboCam capture frame" caption="A representative captured frame from a well-plate imaging run." %}
Note: there are old candidate frames in the archived RoboCam repos on disk, but I couldn't confirm they're actually representative captures rather than unrelated test shots — worth reviewing yourself before using one here rather than guessing.
-->

## Origins & Version History

RoboCam builds on prior work in the same lab and open-source community rather than starting from scratch — each rebuild below happened for a specific reason, not just for its own sake:

1. **[FlyCam](https://github.com/E-Lab-SFSU/FlyCam)** (Esquerra Lab, SFSU) — the original 3D-printer-as-imaging-stage concept that inspired this platform, and the earliest of everything here. Its GUI was originally built on PySimpleGUI, later migrated to the FreeSimpleGUI fork after PySimpleGUI's license changed to a paid/restricted model — the same licensing shift is why every project below built its GUI on Tkinter (and later PySide6) instead.
2. **[screamuch/RoboCam](https://github.com/screamuch/RoboCam)** — the base RoboCam implementation this project's suite was built on. Development continued here rather than on the original repo because that repo's author was no longer around to keep working on it.
3. **[RoboCam-Suite](https://github.com/dairyking98/RoboCam-Suite)** — the first working suite built from that base: a Tkinter GUI, Raspberry Pi + Picamera2 imaging, GPIO laser control, and calibrate/preview/experiment applications. It was designed to generalize across different devices and experiments, but in practice was only built out with StentorCam in mind. Partway through, Player One monochrome astrophotography camera support was added alongside Picamera2 — the Raspberry Pi camera's monochrome sensitivity wasn't good enough for the imaging this needed, so a dedicated monochrome astro camera was brought in, accepting slower USB-based capture as the tradeoff.
4. **[RoboCam-Suite2.0](https://github.com/dairyking98/RoboCam-Suite2.0)** — a complete modular rewrite: cross-platform (Windows/macOS/Linux), moved off Tkinter to a PySide6 GUI, pluggable camera/motion drivers (carrying Player One, Picamera2, and OpenCV forward), and full hardware simulation mode.
5. **[RoboCam3.1](https://github.com/dairyking98/RoboCam3.1)** (current) — a clean rewrite on top of 2.0's foundation: a fresh GUI implementation, expanded camera support, and Klipper support — driving the laser/stimulus output through the 3D printer's own control board via G-code instead of Raspberry Pi GPIO, ahead of hardware built around Klipper controllers rather than Marlin-only boards. Also adds dual motion backends, burst-mode capture, and a post-processing pipeline for converting raw sensor data into frames and video.

## Repository

The current, actively developed version is [RoboCam3.1](https://github.com/dairyking98/RoboCam3.1), kept in sync with the lab-side [E-Lab-SFSU/RoboCam3.1](https://github.com/E-Lab-SFSU/RoboCam3.1) repo, which also hosts the [full documentation site](https://e-lab-sfsu.github.io/RoboCam3.1/). Earlier stages of the project are preserved in [RoboCam-Suite2.0](https://github.com/dairyking98/RoboCam-Suite2.0) and [RoboCam-Suite](https://github.com/dairyking98/RoboCam-Suite).
