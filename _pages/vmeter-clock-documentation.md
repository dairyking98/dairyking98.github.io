---
layout: single
title: "Voltmeter Clock: Documentation"
permalink: /vmeter-clock/documentation/
description: Hardware, pin configuration, and functionality reference for the Analog Voltmeter Clock.
author_profile: false
---


## Overview

The **Voltmeter Clock** is an Arduino-based project that displays time and environmental data using analog voltmeters. The device uses three voltmeters to show either:
- **Time Mode**: Hours, minutes, and seconds
- **PTH Mode**: Pressure, Temperature, and Humidity

The voltmeters are controlled via PWM (Pulse Width Modulation) signals, where the voltage level corresponds to the displayed value. The device features a real-time clock (RTC) for accurate timekeeping and multiple sensors for environmental monitoring.

---

## Hardware Components

### Microcontroller
- **Arduino** (compatible board)

### Sensors
1. **BMP180** - Barometric pressure and temperature sensor
   - Pressure range: 950-1030 hPa
   - Temperature: Celsius readings
   
2. **DHT22** - Humidity and temperature sensor
   - Humidity range: 0-100% RH
   - Temperature: Fahrenheit readings

3. **DS1307 RTC** (via uRTCLib) - Real-time clock module
   - Maintains accurate time even when power is off

### Display Components
- **3 Analog Voltmeters** - Used as display devices
  - Hour voltmeter (PWM pin 9)
  - Minute voltmeter (PWM pin 5)
  - Second voltmeter (PWM pin 6)

### Input Components
- **Rotary Encoder** (Limit Switch) - For time adjustment
  - Pin A: Digital pin 2 (interrupt-enabled)
  - Pin B: Digital pin 3 (interrupt-enabled)
  
- **Button** - For mode switching and time adjustment
  - Digital pin 4 (with internal pull-up)

### Indicator LEDs
- **Hour LED** (Pin 8) - Indicates hour display/adjustment
- **Minute LED** (Pin 10) - Indicates minute display/adjustment
- **Second LED** (Pin 11) - Indicates second display/adjustment
- **PTH LED** (Pin 12) - Indicates PTH mode active

---

## Pin Configuration

| Component | Pin | Type | Description |
|-----------|-----|------|-------------|
| Hour Voltmeter | 9 | PWM Output | Displays hours or pressure |
| Minute Voltmeter | 5 | PWM Output | Displays minutes or temperature |
| Second Voltmeter | 6 | PWM Output | Displays seconds or humidity |
| Button | 4 | Digital Input | Mode toggle and time adjustment |
| DHT22 Sensor | 7 | Digital Input | Humidity/temperature sensor |
| Hour LED | 8 | Digital Output | Hour indicator |
| Minute LED | 10 | Digital Output | Minute indicator |
| Second LED | 11 | Digital Output | Second indicator |
| PTH LED | 12 | Digital Output | PTH mode indicator |
| Rotary Encoder A | 2 | Digital Input (Interrupt) | Encoder signal A |
| Rotary Encoder B | 3 | Digital Input (Interrupt) | Encoder signal B |
| BMP180 | I2C | I2C Bus | Pressure/temperature sensor |
| RTC (DS1307) | I2C (0x68) | I2C Bus | Real-time clock |

---

## Software Architecture

### Libraries Used
- `Arduino.h` - Core Arduino functionality
- `uRTCLib.h` - Real-time clock library for DS1307
- `Adafruit_Sensor.h` - Sensor abstraction layer
- `Adafruit_BMP085_U.h` - BMP180 pressure sensor library
- `DHT.h` - DHT22 humidity sensor library

### Key Variables

#### Display Values
- `hrVal`, `minVal`, `secVal` - PWM values (0-255) for each voltmeter
- `displayMode` - Current mode (0 = Time, 1 = PTH)

#### Time Variables
- `quarterSecVal` - Sub-second PWM adjustment for smooth second hand movement
- `currentSec` - Current second value for quarter-second tracking

#### Sensor Data
- `pressure` - Pressure in hPa (from BMP180)
- `temperature` - Temperature in °C (from BMP180)
- `humidity` - Humidity in % RH (from DHT22)
- `dhtTemperature` - Temperature in °F (from DHT22)

#### Adjustment Variables
- `counter` - Rotary encoder counter value
- `isAdjustingTime` - Flag indicating time adjustment mode
- `currentAdjustmentStep` - Current adjustment step (0=Hour, 1=Minute, 2=Second)

---

## Functionality

### Display Modes

#### Mode 0: Time Display
The voltmeters display the current time:
- **Hour Voltmeter**: Shows hours (0-12, 12-hour format)
  - Formula: `(hour % 12 + minute / 60.0) * 255.0 / 12`
  - Includes fractional hour based on minutes
  
- **Minute Voltmeter**: Shows minutes (0-60)
  - Formula: `(minute + second / 60.0) * 255.0 / 60`
  - Includes fractional minute based on seconds
  
- **Second Voltmeter**: Shows seconds (0-60)
  - Formula: `map(second, 0, 60, 0, 255) + quarterSecVal`
  - Includes quarter-second interpolation for smooth movement

#### Mode 1: PTH Display (Pressure, Temperature, Humidity)
The voltmeters display environmental data:
- **Hour Voltmeter**: Pressure (950-1030 hPa mapped to 0-255)
- **Minute Voltmeter**: Temperature (40-100°F mapped to 0-255)
- **Second Voltmeter**: Humidity (0-100% RH mapped to 0-255)

### Time Adjustment Mode

To adjust the time:
1. **Long Press** the button (hold for >500ms) to enter adjustment mode
2. The device cycles through three adjustment steps:
   - **Step 0**: Adjust hours (0-11)
   - **Step 1**: Adjust minutes (0-59)
   - **Step 2**: Adjust seconds (0-59)
3. Use the **rotary encoder** to change values
4. **Press the button** to confirm and move to the next step
5. After setting seconds, adjustment mode exits automatically

### LED Indicators

#### Normal Operation
- **Time Mode (Mode 0)**:
  - Hour, Minute, Second LEDs: ON
  - PTH LED: OFF
  
- **PTH Mode (Mode 1)**:
  - Hour, Minute, Second LEDs: OFF
  - PTH LED: ON

#### Time Adjustment Mode
- The LED corresponding to the current adjustment step **blinks** (500ms interval)
- Other LEDs are OFF

### Rotary Encoder

The rotary encoder uses interrupt-driven quadrature decoding:
- **Clockwise rotation**: Increments counter
- **Counter-clockwise rotation**: Decrements counter
- Counter is constrained based on current adjustment step:
  - Hours: 0-11
  - Minutes: 0-59
  - Seconds: 0-59

### Quarter-Second Interpolation

For smooth second hand movement, the code implements quarter-second interpolation:
- Divides each second into 4 quarters (0-250ms, 250-500ms, 500-750ms, 750-1000ms)
- Adds incremental PWM values during each quarter
- Provides smooth analog movement between second ticks

---

## Operation Guide

### Initial Setup

1. **Upload the code** to your Arduino board
2. **Connect all components** according to the pin configuration
3. **Power on** the device
4. The device will initialize sensors and start displaying time

### Normal Operation

#### Viewing Time
- By default, the device displays time on the three voltmeters
- Hour, Minute, and Second LEDs are lit to indicate time mode
- The second hand moves smoothly with quarter-second interpolation

#### Viewing Environmental Data
1. **Short press** the button to switch to PTH mode
2. The PTH LED lights up
3. Voltmeters now display:
   - Pressure (left voltmeter)
   - Temperature (middle voltmeter)
   - Humidity (right voltmeter)
4. **Short press** again to return to time mode

### Adjusting Time

1. **Long press** the button (hold for more than 0.5 seconds)
2. The Hour LED starts blinking, indicating hour adjustment mode
3. **Rotate the encoder** to set the desired hour (0-11)
4. **Press the button** to confirm and move to minute adjustment
5. The Minute LED blinks
6. **Rotate the encoder** to set minutes (0-59)
7. **Press the button** to confirm and move to second adjustment
8. The Second LED blinks
9. **Rotate the encoder** to set seconds (0-59)
10. **Press the button** to finish adjustment
11. The device returns to normal operation (starts in PTH mode, press button to return to time)

### Serial Monitor (Optional)

If `debug_println` is enabled, the serial monitor (9600 baud) will display:
- Current time (in Time mode)
- Pressure, Temperature, Humidity (in PTH mode)
- Debug information about button presses, encoder movements, etc.

---

## Technical Details

### PWM Mapping

#### Time Display
- **Hours**: 12-hour format mapped to 0-255 PWM
  - 0 = 12:00 AM/PM
  - 127.5 = 6:00 AM/PM
  - 255 = 12:00 AM/PM (wrap-around)
  
- **Minutes**: 0-60 minutes mapped to 0-255 PWM
  - Linear mapping with fractional seconds included
  
- **Seconds**: 0-60 seconds mapped to 0-255 PWM
  - Includes quarter-second interpolation for smoothness

#### PTH Display
- **Pressure**: 950-1030 hPa → 0-255 PWM
  - Linear mapping
  - Values outside range are constrained
  
- **Temperature**: 40-100°F → 0-255 PWM
  - Linear mapping
  - Values outside range are constrained
  
- **Humidity**: 0-100% RH → 0-255 PWM
  - Linear mapping
  - Direct percentage to PWM conversion

### Sensor Reading Intervals

- Sensors are read continuously in the main loop
- Serial output updates every 500ms (blink interval)
- RTC data is refreshed every loop iteration

### Error Handling

- **BMP180**: Returns -1 for pressure/temperature if read fails
- **DHT22**: Returns -1 for humidity/temperature if read fails
- Sensor initialization failures halt execution with error message

---

## Troubleshooting

### Voltmeters Not Moving
- Check PWM pin connections (9, 5, 6)
- Verify voltmeters are properly calibrated
- Check power supply to voltmeters

### Time Not Accurate
- Verify RTC module is connected and powered
- Check I2C connections (SDA/SCL)
- Ensure RTC has backup battery

### Sensors Not Reading
- **BMP180**: Check I2C connections and power
- **DHT22**: Verify pin 7 connection and power
- Check sensor wiring and pull-up resistors

### Button Not Responding
- Verify button is connected to pin 4
- Check internal pull-up is working
- Test button continuity

### Rotary Encoder Not Working
- Verify pins 2 and 3 connections
- Check interrupt functionality
- Ensure encoder has proper power and ground

### LEDs Not Indicating
- Check LED pin connections (8, 10, 11, 12)
- Verify LED polarity and current-limiting resistors
- Test LED pins individually

---

## Future Enhancements

The code includes a placeholder for brightness adjustment (step 3 in adjustment mode), but this feature is not yet implemented. The `maxCounter` is set to 20 for this step, but the functionality is not active.

---

## Code Structure

### Main Functions

- `setup()` - Initializes pins, sensors, interrupts, and serial communication
- `loop()` - Main program loop handling button input, time adjustment, and display updates
- `updateTimeDisplay()` - Calculates and outputs PWM values for time display
- `updatePTH()` - Calculates and outputs PWM values for environmental data
- `adjustTime()` - Handles time adjustment mode logic
- `displayAdjustment()` - Shows current adjustment value on voltmeters
- `updateEncoderA()` / `updateEncoderB()` - Interrupt handlers for rotary encoder
- `readPressure()` - Reads BMP180 sensor data
- `readHumidity()` - Reads DHT22 sensor data
- `toggleDisplayMode()` - Switches between time and PTH modes
- `controlLEDsBasedOnDisplayMode()` - Controls LED indicators
- `blinkPin()` - Blinks LED at specified interval
- `handleQuarterSec()` - Implements quarter-second interpolation
- `blinkDisplaySerial()` - Outputs serial data at intervals

---

## License

This project is provided as-is for educational and personal use.

---

## Author Notes

This voltmeter clock project combines analog display aesthetics with modern sensor technology, creating a unique timepiece that also serves as an environmental monitoring station. The smooth analog movement of the voltmeters provides a classic watch-like experience while displaying both time and real-time environmental conditions.

