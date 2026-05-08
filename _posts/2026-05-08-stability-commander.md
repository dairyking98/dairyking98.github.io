---
layout: post
title: Stability COMmander
subtitle: Hardware-Validated Stability Control for a Telehandler Prototype
date: 2026-05-08 12:00:00 -0700
permalink: /blog/2026/stability-commander/
description: Real-time telehandler stability control prototype tracking vehicle–load center of mass against the support polygon — STM32 embedded logic, MATLAB/Simulink HIL, Pygame visualization, and a fabricated boom prototype.
tags: school-project capstone mechanical-engineering embedded-systems control-systems cad fabrication stm32 matlab simulink python hardware-in-the-loop simulation
categories: School Projects
thumbnail: assets/img/2026/stability-commander/cad-assembly.png
---

**Stability COMmander** is a real-time telehandler stability control project designed to prevent tip-over by tracking the vehicle–load center of mass and evaluating it against the machine’s support polygon. The system combines embedded control logic, dynamic simulation, and a physical prototype to validate stability behavior under realistic mechanical constraints.

## My contribution

My largest contribution was the **hardware** side of the project. I was responsible for hardware selection, 3D CAD design, fabrication, and geometry validation of the physical prototype.

I selected components based on operating voltage, required torque, actuator motion requirements, and overall project budget. I also designed the boom and mounting geometry in CAD so the actuators could achieve the desired range of motion while accurately representing telehandler behavior.

The physical prototype mattered because it turned the project from a purely digital simulation into a system that could be tested against real hardware constraints.

## Key responsibilities

- Selected motors, actuators, drivers, and mechanical components based on voltage, torque, cost, and system requirements
- Designed the boom structure and actuator mounting points in 3D CAD
- Fabricated and assembled the physical prototype
- Validated boom geometry to confirm the actuators could reach the desired range of motion
- Supported integration between the physical prototype, embedded control logic, and simulation model
- Identified mechanical limitations that affected system stability and actuator performance

## Technical highlights

- STM32-based embedded control system
- Hardware-in-the-loop validation with MATLAB/Simulink
- Real-time center of mass calculation
- Support polygon stability evaluation
- 1 cm stability margin for safety enforcement
- Python/Pygame visualization of vehicle motion, boom position, COM location, and stability boundaries
- Physical prototype used to validate geometry and system assumptions

## Engineering challenge

One of the hardest parts of the project was getting the **boom geometry** right. Actuator stroke length, mounting position, and linkage geometry all had to work together so the boom could achieve the full desired range of motion.

Small changes in actuator placement significantly affected how the boom moved, so I iterated on the CAD design until the mechanism could extend and rotate properly without hitting mechanical limits.

## Design issue and lesson learned

During testing, we discovered that the selected actuators were **backdriveable**. The load required to approach a tipping condition exceeded the actuators’ static holding capability, so the boom could move when it was supposed to remain fixed.

Addressing this would have required **active position maintenance** (for example closed-loop actuator control), which we could not fully implement within the project timeline.

This was an important lesson: for stability-critical mechanical systems, **actuator holding force and backdrivability** matter as much as motion capability.

## STAR experience

**Situation**  
Our team was developing a stability control system for a telehandler, but simulation alone would not fully capture real-world mechanical constraints.

**Task**  
My task was to design and build a physical prototype that accurately represented the boom geometry and allowed the stability control concept to be validated beyond a purely theoretical model.

**Action**  
I selected hardware based on voltage, torque, actuator motion, cost, and system compatibility. I designed the boom and actuator mounting geometry in CAD, fabricated the assembly, and validated that the actuators achieved the intended range of motion. When we found the actuators were backdriveable under higher loads, I helped identify the cause and concluded that active position maintenance would be needed for future work.

**Result**  
The prototype moved the project beyond digital simulation and gave the team a physical platform for validating geometry, actuation limits, and stability assumptions. The hardware work made the control system more realistic and highlighted practical challenges in safety-critical control on real equipment.

## Impact

Without the physical prototype, the project would have stayed a theoretical simulation. The hardware made it possible to evaluate real-world constraints such as actuator placement, boom range of motion, fabrication tolerances, and load-holding limitations.

The project strengthened my experience in mechanical design, hardware selection, CAD modeling, fabrication, embedded systems integration, and engineering tradeoff analysis.

## Skills

- 3D CAD design  
- Hardware selection  
- Mechanical fabrication  
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

{% include figure.liquid path="assets/img/2026/stability-commander/cad-assembly.png" class="img-fluid rounded z-depth-1" alt="Full CAD assembly of the Stability COMmander telehandler prototype" caption="Full CAD assembly used to validate actuator stroke, mounting geometry, and boom range of motion prior to fabrication." %}

### Physical prototype

{% include figure.liquid path="assets/img/2026/stability-commander/physical-prototype.jpeg" class="img-fluid rounded z-depth-1" alt="Fabricated physical prototype boom and actuator hardware" caption="Fabricated prototype used to check real linkage motion, actuator placement, and load-holding behavior against the CAD intent." %}

### Hardware architecture

{% include figure.liquid path="assets/img/2026/stability-commander/hardware-signals-flowchart.jpeg" class="img-fluid rounded z-depth-1" alt="Flowchart of onboard hardware architecture and signal paths" caption="Hardware and signal flow between sensors, MCU, actuator drivers, and power paths." %}

### Visualization

{% include figure.liquid path="assets/img/2026/stability-commander/pygame-visualization.jpeg" class="img-fluid rounded z-depth-1" alt="Pygame visualization of chassis motion, boom, and stability bounds" caption="Interactive visualization tying vehicle kinematics and stability diagnostics to operators and debug scenarios." %}

## Links

- **GitHub:** *[repository URL — add when ready]*  
- **Demo video:** *[link — add when ready]*  
- **Portfolio / resume:** *[optional link — add when ready]*  

---

*Capstone project — hardware focus: boom prototype, integration, and mechanical validation.*
