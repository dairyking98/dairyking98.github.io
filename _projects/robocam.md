---
layout: single
title: RoboCam
description: RoboCam system for automated camera control and 3D printer integration
header:
  teaser: /assets/img/12.jpg
importance: 1
category: school-project
github: https://github.com/dairyking98/RoboCam-Suite
---

RoboCam is an automated camera control system that integrates Raspberry Pi camera hardware with 3D printer motion control for precise positioning and imaging automation. The system enables automated calibration, experiment execution, and camera control through a suite of Python scripts.

## Project Overview

RoboCam provides a complete solution for automated imaging workflows, combining:

- **Raspberry Pi Camera Integration**: High-resolution imaging with Picamera2
- **3D Printer Motion Control**: G-code based positioning via serial communication
- **Calibration System**: 4-corner calibration for precise positioning
- **Experiment Automation**: GUI-based experiment design and execution
- **Laser Control**: GPIO-controlled laser for illumination

## Key Features

- **Automated Calibration**: 4-corner calibration system for accurate positioning
- **Experiment Automation**: GUI application for designing and running automated experiments
- **Preview System**: Real-time preview and alignment checking
- **Video Recording**: Automated video capture with configurable settings
- **Motion Control**: Integration with Marlin/RepRap compatible 3D printers via G-code
- **Camera Control**: Full control over camera settings, resolution, and frame rates

## Technical Implementation

The RoboCam system is built using:

- **Python** for automation and control
- **Picamera2** for Raspberry Pi camera interface
- **Tkinter** for GUI applications
- **Serial Communication** for 3D printer control
- **GPIO** for laser control

## Repository

The complete source code, documentation, and setup instructions are available in the [RoboCam-Suite repository](https://github.com/dairyking98/RoboCam-Suite). The project website is hosted at [dairyking98.github.io/RoboCam-Suite](https://dairyking98.github.io/RoboCam-Suite/).

---
