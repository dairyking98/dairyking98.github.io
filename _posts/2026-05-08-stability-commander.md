---
layout: single
title: Stability COMmander
subtitle: Hardware-Validated Stability Control for a Scale Telehandler Prototype
date: 2026-05-08 12:00:00 -0700
permalink: /blog/2026/stability-commander/
description: Real-time telehandler stability control prototype tracking vehicle–load center of mass against the support polygon — STM32 embedded logic, MATLAB/Simulink HIL, Pygame visualization, and a fabricated scale-model boom.
tags: school-project capstone mechanical-engineering embedded-systems control-systems cad fabrication stm32 matlab simulink python hardware-in-the-loop simulation
categories: School Projects
header:
  teaser: /assets/img/2026/stability-commander/cad-assembly.png
---

**Stability COMmander** is a senior capstone project (Team-o-Matic: Ben Grimes, Mohammed Azam, Samuel Zimmerickers, and me) that tracks a telehandler's vehicle–load center of mass in real time and evaluates it against the machine's support polygon to predict and prevent tip-over, rather than relying on the fixed load charts and static safety margins that traditional systems use.

## It didn't start here

The project spent its first semester as something else entirely. In ENGR 696 (Fall 2025) we cycled through several ideas — mold detection, single-cell particle separation, a battery-swapping system for electric vehicles — before settling on a **modular battery swapping system** for port and yard vehicles: a boom crane with hydraulic actuation, swapping standardized battery packs in under 90 seconds so electric equipment could run 24/7 without charging downtime. We built out a full design package around it that semester — team charter, design specs, an IRA funding request, a six-week Gantt chart for a hydraulic boom-crane prototype.

Early in ENGR 697GW (Spring 2026), that concept started to strain: it had grown into a broad, multi-subsystem idea — batteries, a crane, a transport vehicle — and demonstrating the *concept* would have meant building several sub-projects at once. After our first meeting that semester, Sam proposed reframing the goal entirely: instead of executing the swap, use the same crane/telehandler chassis to solve a narrower, more tangible problem — calculating a vehicle's center of mass on the fly to predict loss of stability before it tips, rather than relying on fixed safety margins or after-the-fact alarms. We framed it as a "predictive stability management system for mobile industrial vehicles." It simplified the scope significantly and gave the team a much clearer, more measurable goal to build toward — Stability COMmander.

## Team roles

Per our team charter (updated for the second semester once our working style had settled):

- **Leonard (me) — Mechanical Design and Scheduling Lead:** CAD development, physical system layout, material selection, and coordinating timelines/task assignments
- **Sam — Simulation, Electronics, and Embedded Systems:** Simulink plant and hardware-in-the-loop models, circuit hardware, embedded programming, STM32 integration
- **Ben — Documentation, Presentation, and Design Support:** stakeholder presentations, videos, and project communication, plus CAD support as needed
- **Mohammed — Testing and Integration Support:** flexible support across testing, validation, and subsystem integration

## My contribution

My work centered on the physical prototype: the boom's structural design and validation, and the hardware that let the stability concept be tested against real mechanical constraints instead of staying purely theoretical.

For the structural analysis, I was assigned the boom's free body diagram, bending moment and shear force calculations, max stress estimation, actuator force vs. required lift torque, and factor-of-safety justification — worked by hand via analytical beam theory, then cross-checked with a 3D chassis CAD model and FEA for load, stress, and weight distribution in Fusion 360.

On the hardware side, I selected components based on operating voltage, required torque, actuator motion, and budget, and designed the boom and mounting geometry so the actuators could achieve the desired range of motion while representing telehandler kinematics. This is a **scale model** — Actuonix linear actuators (not full hydraulic cylinders), a load cell on the fork, and a 12 V supply, sized to fit lab budget and safety constraints rather than a full-size machine.

## Engineering challenge

Getting the **boom geometry** right was the hardest mechanical part: actuator stroke length, mounting position, and linkage geometry all had to work together for the boom to reach its full intended range of motion without hitting mechanical limits. Small changes in actuator placement significantly changed how the boom moved, so I iterated the CAD design — and the Ackermann steering geometry for the drive base — until it worked.

## Design issue and lesson learned

During testing, the selected actuators turned out to be **backdriveable**: the load required to approach a tipping condition exceeded their static holding capability, so the boom could move when it was supposed to stay fixed. Fixing this properly would mean active position maintenance (closed-loop actuator control), which we couldn't fully implement within the project timeline. The lesson: for stability-critical mechanical systems, actuator holding force and backdrivability matter as much as motion capability.

## Technical highlights

- STM32-based embedded control system
- Hardware-in-the-loop validation with MATLAB/Simulink
- Real-time center of mass calculation
- Support polygon stability evaluation
- 1 cm stability margin for safety enforcement
- Python/Pygame visualization of vehicle motion, boom position, COM location, and stability boundaries
- Physical scale-model prototype used to validate geometry and system assumptions

## Impact

Without the physical prototype, this would have stayed a theoretical simulation. Building it surfaced real-world constraints — actuator placement, boom range of motion, fabrication tolerances, and the load-holding limitation above — that the digital model alone wouldn't have caught. The project as a whole strengthened my mechanical design, hardware selection, CAD modeling, fabrication, embedded-systems integration, and engineering tradeoff analysis — and the mid-project pivot was its own lesson in scoping a capstone project down to something a small team can actually finish.

## Skills

- 3D CAD design
- Hardware selection
- Mechanical fabrication
- Analytical beam theory / structural analysis
- Geometry validation
- Actuator sizing
- Embedded systems
- MATLAB/Simulink
- STM32
- Python visualization
- System integration
- Engineering tradeoff analysis

## Media

### CAD assembly

{% include figure image_path="assets/img/2026/stability-commander/cad-assembly.png" alt="Full CAD assembly of the Stability COMmander telehandler prototype" caption="Full CAD assembly used to validate actuator stroke, mounting geometry, and boom range of motion prior to fabrication." %}

### Physical prototype

{% include figure image_path="assets/img/2026/stability-commander/physical-prototype.jpeg" alt="Fabricated physical prototype boom and actuator hardware" caption="Fabricated prototype used to check real linkage motion, actuator placement, and load-holding behavior against the CAD intent." %}

### Hardware architecture

{% include figure image_path="assets/img/2026/stability-commander/hardware-signals-flowchart.jpeg" alt="Flowchart of onboard hardware architecture and signal paths" caption="Hardware and signal flow between sensors, MCU, actuator drivers, and power paths." %}

### Visualization

{% include figure image_path="assets/img/2026/stability-commander/pygame-visualization.jpeg" alt="Pygame visualization of chassis motion, boom, and stability bounds" caption="Interactive visualization tying vehicle kinematics and stability diagnostics to operators and debug scenarios." %}

## Links

- **GitHub:** [Team-O-Matic-2025](https://github.com/dairyking98/Team-O-Matic-2025)

---

*Capstone project — hardware focus: boom prototype, structural analysis, and mechanical validation.*
