# Voltmeter Clock - Quick Operation Guide

## Quick Start

### Power On

1. Connect power to Arduino
2. Wait for sensors to initialize (~2 seconds)
3. Device starts in **Time Mode** by default

---

## Normal Operation

### Viewing Time (Default Mode)

- **Three voltmeters display**:
  - **Left**: Hours (0-12, 12-hour format)
  - **Middle**: Minutes (0-60)
  - **Right**: Seconds (0-60)
- **LEDs**: Hour, Minute, Second LEDs are ON (solid)
- **Behavior**: Second hand moves smoothly with quarter-second interpolation

### Viewing Environmental Data (PTH Mode)

1. **Press button briefly** (< 0.5 seconds)
2. **Voltmeters switch to display**:
   - **Left**: Pressure (950-1030 hPa)
   - **Middle**: Temperature (40-100°F)
   - **Right**: Humidity (0-100% RH)
3. **LED**: PTH LED turns ON
4. **Return to time**: Press button again briefly

---

## Time Adjustment Procedure

### Entering Adjustment Mode

1. **Hold button** for more than 0.5 seconds (long press)
2. Device enters adjustment mode
3. **Hour LED starts blinking**

### Adjusting Hours

1. **Rotate encoder** clockwise/counter-clockwise
2. **Left voltmeter** shows current hour value (0-11)
3. **Hour LED blinks** to indicate active adjustment
4. **Press button** to confirm and move to minutes

### Adjusting Minutes

1. **Rotate encoder** to set minutes (0-59)
2. **Middle voltmeter** shows current minute value
3. **Minute LED blinks** to indicate active adjustment
4. **Press button** to confirm and move to seconds

### Adjusting Seconds

1. **Rotate encoder** to set seconds (0-59)
2. **Right voltmeter** shows current second value
3. **Second LED blinks** to indicate active adjustment
4. **Press button** to finish adjustment
5. Device exits adjustment mode and enters PTH mode
6. **Press button briefly** to return to time mode

---

## Visual Indicators

### LED Status Meanings

| LED State                    | Meaning                       |
| ---------------------------- | ----------------------------- |
| Hour/Min/Sec LEDs ON (solid) | Time mode active              |
| PTH LED ON (solid)           | PTH mode active               |
| Hour LED blinking            | Adjusting hours               |
| Minute LED blinking          | Adjusting minutes             |
| Second LED blinking          | Adjusting seconds             |
| All LEDs OFF                 | Adjustment mode (other steps) |

### Voltmeter Behavior

#### Time Mode

- **Smooth continuous movement** of all three hands
- **Second hand** has quarter-second interpolation for fluid motion
- **Hour hand** includes fractional hours based on minutes
- **Minute hand** includes fractional minutes based on seconds

#### PTH Mode

- **Real-time updates** of environmental data
- **Pressure**: Higher pressure = higher voltage (right side of scale)
- **Temperature**: Higher temperature = higher voltage (right side of scale)
- **Humidity**: Higher humidity = higher voltage (right side of scale)

#### Adjustment Mode

- **Only the active voltmeter** shows the adjustment value
- **Other voltmeters** are at zero
- **Value updates** as you rotate the encoder

---

## Button Functions

| Action                | Duration      | Function                           |
| --------------------- | ------------- | ---------------------------------- |
| Short Press           | < 0.5 seconds | Toggle between Time and PTH modes  |
| Long Press            | > 0.5 seconds | Enter time adjustment mode         |
| Press (in adjustment) | Any duration  | Confirm current step, move to next |

---

## Rotary Encoder Functions

| Action                   | Function                                                               |
| ------------------------ | ---------------------------------------------------------------------- |
| Rotate Clockwise         | Increase value                                                         |
| Rotate Counter-clockwise | Decrease value                                                         |
| Value Range              | Depends on adjustment step (Hours: 0-11, Minutes: 0-59, Seconds: 0-59) |

---

## Typical Usage Scenarios

### Scenario 1: Daily Time Display

1. Power on device
2. Device automatically shows time
3. No interaction needed
4. Watch the smooth analog movement

### Scenario 2: Check Weather Conditions

1. Press button briefly
2. Observe PTH readings on voltmeters
3. Press button again to return to time

### Scenario 3: Set Time After Power Loss

1. Long press button to enter adjustment
2. Set hours using encoder, press button
3. Set minutes using encoder, press button
4. Set seconds using encoder, press button
5. Press button to finish
6. Press button briefly to return to time mode

### Scenario 4: Quick Time Check

- Just look at the voltmeters - no button press needed
- LEDs indicate you're in time mode

---

## Troubleshooting Quick Reference

| Problem               | Solution                                |
| --------------------- | --------------------------------------- |
| Voltmeters not moving | Check power, verify PWM pin connections |
| Wrong time            | Enter adjustment mode and reset time    |
| Can't switch modes    | Check button connection to pin 4        |
| Encoder not working   | Verify pins 2 and 3 connections         |
| LEDs not lighting     | Check LED connections and resistors     |
| Sensors not reading   | Verify sensor wiring and power          |

---

## Tips for Best Experience

1. **Calibration**: Ensure voltmeters are properly calibrated for accurate readings
2. **Lighting**: Position LEDs where they're visible but not distracting
3. **Placement**: Keep sensors away from heat sources for accurate readings
4. **Power**: Use stable power supply for consistent voltmeter readings
5. **Serial Monitor**: Enable debug mode to see sensor readings and system status

---

## Mode Summary

```
┌─────────────────────────────────────────┐
│  TIME MODE (Default)                    │
│  - Voltmeters: Hours, Minutes, Seconds  │
│  - LEDs: Hour, Min, Sec ON              │
│  - Action: Short press → PTH Mode       │
└─────────────────────────────────────────┘
              ↓ (Short Press)
┌─────────────────────────────────────────┐
│  PTH MODE                                │
│  - Voltmeters: Pressure, Temp, Humidity │
│  - LED: PTH ON                           │
│  - Action: Short press → Time Mode      │
└─────────────────────────────────────────┘
              ↓ (Long Press)
┌─────────────────────────────────────────┐
│  ADJUSTMENT MODE                        │
│  - Step 0: Adjust Hours (LED blinks)    │
│  - Step 1: Adjust Minutes (LED blinks)  │
│  - Step 2: Adjust Seconds (LED blinks)  │
│  - Action: Press to confirm each step   │
└─────────────────────────────────────────┘
```

---

## Quick Command Reference

| What You Want   | What To Do                                     |
| --------------- | ---------------------------------------------- |
| View time       | Do nothing (default mode)                      |
| View weather    | Short press button                             |
| Set time        | Long press button, then follow steps           |
| Increase value  | Rotate encoder clockwise                       |
| Decrease value  | Rotate encoder counter-clockwise               |
| Confirm setting | Press button                                   |
| Exit adjustment | Complete all 3 steps (hours, minutes, seconds) |
