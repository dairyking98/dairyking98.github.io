---
layout: page
title: Voltmeter Clock Technical Documentation
permalink: /vmeter-clock/technical/
description: Detailed technical documentation including code architecture, algorithms, and implementation details
nav: true
nav_order: 12
---

# Voltmeter Clock - Technical Documentation

## Code Architecture

### Program Flow

```
setup()
  ├── Initialize Serial (9600 baud)
  ├── Initialize I2C (RTC, BMP180)
  ├── Configure PWM pins (9, 5, 6)
  ├── Configure input pins (button, encoder)
  ├── Attach interrupts (encoder pins 2, 3)
  ├── Initialize BMP180 sensor
  └── Initialize DHT22 sensor

loop() [Continuous]
  ├── Read button state
  ├── Detect button press/release
  │   ├── Short press → Toggle display mode
  │   └── Long press → Enter time adjustment
  ├── If adjusting time
  │   └── adjustTime()
  ├── If not adjusting
  │   ├── Read sensors (humidity, pressure)
  │   ├── Update display based on mode
  │   │   ├── Mode 0 → updateTimeDisplay()
  │   │   └── Mode 1 → updatePTH()
  │   └── Output serial data (if enabled)
  ├── Control LEDs based on mode
  ├── Refresh RTC data
  └── Set encoder limits based on adjustment step
```

---

## Core Algorithms

### 1. Time Display Calculation

#### Hour Calculation

```cpp
hrVal = (rtc.hour() % 12 + rtc.minute() / 60.0) * 255.0 / 12
```

**Explanation**:

- `rtc.hour() % 12`: Converts 24-hour to 12-hour format (0-11)
- `+ rtc.minute() / 60.0`: Adds fractional hour based on minutes
- `* 255.0 / 12`: Maps 0-12 range to 0-255 PWM range

**Example**: 3:30 PM

- Hour = 15 % 12 = 3
- Fraction = 30 / 60 = 0.5
- Total = 3.5 hours
- PWM = 3.5 \* 255 / 12 = 74.375

#### Minute Calculation

```cpp
minVal = (rtc.minute() + rtc.second() / 60.0) * 255.0 / 60
```

**Explanation**:

- `rtc.minute()`: Current minute (0-59)
- `+ rtc.second() / 60.0`: Adds fractional minute based on seconds
- `* 255.0 / 60`: Maps 0-60 range to 0-255 PWM range

**Example**: 3:30:45

- Minute = 30
- Fraction = 45 / 60 = 0.75
- Total = 30.75 minutes
- PWM = 30.75 \* 255 / 60 = 130.6875

#### Second Calculation with Quarter-Second Interpolation

```cpp
secVal = map(rtc.second(), 0, 60, 0, 255) + quarterSecVal
```

**Quarter-Second Logic**:

```cpp
void handleQuarterSec() {
  dMillis = millis() - startMillis;
  if (dMillis < 250) {
    quarterSecVal = 0;
  } else if (dMillis < 500) {
    quarterSecVal = 4.25 * 1 / 4;  // = 1.0625
  } else if (dMillis < 750) {
    quarterSecVal = 4.25 * 2 / 4;  // = 2.125
  } else if (dMillis < 1000) {
    quarterSecVal = 4.25 * 3 / 4;  // = 3.1875
  }
}
```

**Explanation**:

- Divides each second into 4 quarters (250ms each)
- Adds incremental PWM value during each quarter
- `4.25` represents the PWM increment per full second (255/60 ≈ 4.25)
- Provides smooth analog movement between second ticks

**Timeline Example** (at second 30):

- 0-250ms: quarterSecVal = 0
- 250-500ms: quarterSecVal = 1.0625
- 500-750ms: quarterSecVal = 2.125
- 750-1000ms: quarterSecVal = 3.1875
- Next second: Reset to 0, new second value

### 2. PTH Display Calculation

#### Pressure Mapping

```cpp
hrVal = map(pressure, minPressureVal, maxPressureVal, 0, 255);
hrVal = constrain(hrVal, 0, 255);
```

**Range**: 950-1030 hPa → 0-255 PWM

- 950 hPa = 0 PWM (minimum)
- 1030 hPa = 255 PWM (maximum)
- Linear interpolation for values in between

#### Temperature Mapping

```cpp
minVal = map(dhtTemperature, minTempVal, maxTempVal, 0, 255);
minVal = constrain(minVal, 0, 255);
```

**Range**: 40-100°F → 0-255 PWM

- 40°F = 0 PWM (minimum)
- 100°F = 255 PWM (maximum)
- Linear interpolation for values in between

#### Humidity Mapping

```cpp
secVal = map(humidity, minRHVal, maxRHVal, 0, 255);
secVal = constrain(secVal, 0, 255);
```

**Range**: 0-100% RH → 0-255 PWM

- 0% = 0 PWM (minimum)
- 100% = 255 PWM (maximum)
- Direct percentage to PWM conversion

### 3. Rotary Encoder Decoding

The code uses **quadrature decoding** with interrupt handlers on both encoder signals.

#### Encoder State Machine

**Signal States**:

- A and B can be HIGH or LOW
- Four possible states: (LOW,LOW), (LOW,HIGH), (HIGH,LOW), (HIGH,HIGH)

**Direction Detection**:

- **Clockwise**: A changes before B (or specific state transitions)
- **Counter-clockwise**: B changes before A (or opposite transitions)

#### Interrupt Handlers

**updateEncoderA()** - Triggered on pin A changes:

```cpp
if (A != A_prev) {  // A has changed
  if (A == LOW) {   // Falling edge
    if (B == HIGH) counter++;  // CW
    else counter--;            // CCW
  } else {          // Rising edge
    if (B == LOW) counter++;   // CW
    else counter--;            // CCW
  }
}
```

**updateEncoderB()** - Triggered on pin B changes:

```cpp
if (B != B_prev) {  // B has changed
  if (B == LOW) {   // Falling edge
    if (A == LOW) counter++;   // CW
    else counter--;            // CCW
  } else {          // Rising edge
    if (A == HIGH) counter++;  // CW
    else counter--;            // CCW
  }
}
```

**Counter Constraints**:

- `counter = constrain(counter, minCounter, maxCounter)`
- Limits based on current adjustment step

### 4. Button State Machine

#### State Detection

```cpp
if (buttonState == LOW && lastButtonState == HIGH) {
  // Button pressed (falling edge)
  buttonPressStart = millis();
  buttonHeld = true;
}
else if (buttonState == HIGH && lastButtonState == LOW) {
  // Button released (rising edge)
  unsigned long pressDuration = millis() - buttonPressStart;

  if (pressDuration >= longPressThreshold) {
    // Long press (>500ms)
    isAdjustingTime = true;
  } else {
    // Short press (<500ms)
    toggleDisplayMode();
  }
}
```

**Debouncing**: Handled by checking state changes (edge detection)

### 5. Time Adjustment State Machine

#### Adjustment Steps

```
Step 0: Hour Adjustment
  ├── Counter range: 0-11
  ├── Display: Only hour voltmeter active
  ├── LED: Hour LED blinking
  └── On button press → Step 1

Step 1: Minute Adjustment
  ├── Counter range: 0-59
  ├── Display: Only minute voltmeter active
  ├── LED: Minute LED blinking
  └── On button press → Step 2

Step 2: Second Adjustment
  ├── Counter range: 0-59
  ├── Display: Only second voltmeter active
  ├── LED: Second LED blinking
  └── On button press → Exit adjustment
```

#### RTC Setting

```cpp
// Step 0: Set hour
rtc.set(0, 0, counter, 0, 0, 0, 0);
// Parameters: second, minute, hour, dayOfWeek, day, month, year

// Step 1: Set minute
rtc.set(0, counter, rtc.hour(), 0, 0, 0, 0);

// Step 2: Set second
rtc.set(counter, rtc.minute(), rtc.hour(), 0, 0, 0, 0);
```

**Note**: The RTC library uses a specific parameter order that may differ from standard time formats.

---

## Interrupt System

### Interrupt Configuration

```cpp
attachInterrupt(digitalPinToInterrupt(pinA), updateEncoderA, CHANGE);
attachInterrupt(digitalPinToInterrupt(pinB), updateEncoderB, CHANGE);
```

**Interrupt Type**: `CHANGE` - Triggers on both rising and falling edges

**Why Interrupts?**:

- Encoder can change rapidly
- Interrupts ensure no encoder steps are missed
- Non-blocking - doesn't delay main loop

**Interrupt Safety**:

- Uses `volatile` variables for shared state
- Minimal processing in interrupt handlers
- Constrains counter values to prevent overflow

---

## Sensor Reading

### BMP180 (Pressure/Temperature)

**Reading Process**:

```cpp
sensors_event_t event;
bmp.getEvent(&event);
if (event.pressure) {
  pressure = event.pressure;  // hPa
  bmp.getTemperature(&temperature);  // °C
}
```

**Error Handling**: Returns -1 if read fails

**Update Frequency**: Every loop iteration (when not adjusting time)

### DHT22 (Humidity/Temperature)

**Reading Process**:

```cpp
humidity = dht.readHumidity();  // % RH
dhtTemperature = dht.readTemperature(true);  // °F (true = Fahrenheit)
```

**Error Handling**: Checks for `NaN` (Not a Number), returns -1 if invalid

**Update Frequency**: Every loop iteration (when not adjusting time)

**Note**: DHT22 requires ~2 seconds between readings (library handles this)

---

## PWM Output

### Arduino PWM Details

**PWM Pins Used**: 9, 5, 6

- **Frequency**: ~490 Hz (pins 5, 6) or ~980 Hz (pin 9) on most Arduino boards
- **Resolution**: 8-bit (0-255)
- **Duty Cycle**: 0 = 0%, 255 = 100%

### Voltmeter Response

**Assumption**: Voltmeters are calibrated to show:

- 0 PWM (0V) = Minimum scale reading
- 255 PWM (5V) = Maximum scale reading

**Smoothing**: Quarter-second interpolation provides smooth analog movement

---

## Timing and Performance

### Loop Timing

- **Typical loop time**: < 10ms (without sensor delays)
- **DHT22 delay**: ~2 seconds between readings (handled by library)
- **Serial output**: Every 500ms (blink interval)

### Non-Blocking Delays

**LED Blinking**:

```cpp
if (currentMillis - previousMillisBlink >= blinkInterval) {
  previousMillisBlink = currentMillis;
  // Toggle LED
}
```

**Serial Output**:

```cpp
if (currentMillis - previousMillisSerial >= blinkInterval) {
  previousMillisSerial = currentMillis;
  // Print data
}
```

**Benefits**:

- Doesn't block main loop
- Allows responsive button/encoder handling
- Smooth display updates

---

## Memory Usage

### RAM (Estimated)

- **Global variables**: ~100 bytes
- **Stack (function calls)**: ~50 bytes
- **Libraries**: ~500-1000 bytes
- **Total**: ~650-1150 bytes (well within Arduino Uno's 2KB SRAM)

### Flash (Estimated)

- **Code**: ~8-12 KB
- **Libraries**: ~15-20 KB
- **Total**: ~23-32 KB (within Arduino Uno's 32KB flash)

---

## Code Optimization Opportunities

### Current Implementation

- **Sensor reads**: Every loop (may be excessive)
- **RTC refresh**: Every loop (may be excessive)
- **Serial output**: Conditional (good)

### Potential Improvements

1. **Add sensor read intervals** (e.g., read every 2 seconds)
2. **Cache RTC values** (refresh every second, not every loop)
3. **Optimize encoder interrupts** (reduce processing)
4. **Add EEPROM storage** for display preferences
5. **Implement brightness control** (placeholder exists)

---

## Debugging Features

### Debug Flag

```cpp
bool debug_println = false;  // Set to true to enable
```

### Debug Output Locations

- Button press/release
- Display mode changes
- Time adjustment steps
- Encoder counter values
- Sensor readings
- PWM values

### Serial Monitor Usage

1. Set `debug_println = true`
2. Open Serial Monitor (9600 baud)
3. Observe real-time system state

---

## Known Limitations

1. **Brightness Control**: Placeholder exists but not implemented
2. **24-hour Format**: Only 12-hour format supported
3. **Date Display**: Not implemented (only time)
4. **Sensor Calibration**: No user calibration for sensor ranges
5. **EEPROM Storage**: Settings not saved across power cycles
6. **Error Recovery**: Limited error recovery for sensor failures

---

## Extension Points

### Easy Additions

1. **Brightness Control**: Implement step 3 in adjustment mode
2. **24-hour Format**: Add toggle for 12/24 hour display
3. **Date Display**: Add date mode (day, month, year)
4. **Alarm Function**: Add time-based alarm
5. **Data Logging**: Store sensor data over time

### Advanced Features

1. **WiFi Connectivity**: Add ESP8266 for remote monitoring
2. **OLED Display**: Add secondary digital display
3. **SD Card Logging**: Store historical sensor data
4. **Web Interface**: Remote control and monitoring
5. **Multiple Time Zones**: Display multiple time zones

---

## Testing Recommendations

### Unit Tests

1. **PWM Calculations**: Verify time/PTH mapping formulas
2. **Encoder Decoding**: Test all rotation directions
3. **Button Detection**: Verify short/long press detection
4. **Sensor Reading**: Test with known values

### Integration Tests

1. **Full Time Adjustment**: Complete adjustment cycle
2. **Mode Switching**: Toggle between modes multiple times
3. **Sensor Display**: Verify PTH readings match actual values
4. **Long-term Operation**: Run for extended periods

### Hardware Tests

1. **Voltmeter Calibration**: Verify PWM to voltmeter response
2. **LED Indicators**: Test all LED states
3. **Power Consumption**: Measure current draw
4. **Temperature Stability**: Test in various temperatures

---

## Code Quality Notes

### Strengths

- Clear variable naming
- Good code organization
- Comprehensive comments
- Modular function design

### Areas for Improvement

- Some magic numbers could be constants
- Error handling could be more robust
- Some functions could be further modularized
- Add input validation for sensor ranges

---

## Dependencies

### Required Libraries

1. **uRTCLib** - RTC communication
2. **Adafruit_Sensor** - Sensor abstraction
3. **Adafruit_BMP085_U** - BMP180 driver
4. **DHT** - DHT22 driver

### Library Installation

Install via Arduino Library Manager:

- Search for "uRTCLib"
- Search for "Adafruit BMP085"
- Search for "DHT sensor library"

---

## Hardware Compatibility

### Tested Platforms

- Arduino Uno (primary target)
- Arduino Nano (should work)
- Arduino Mega (should work)

### Sensor Compatibility

- **BMP180**: Compatible with BMP085 (same library)
- **DHT22**: Compatible with DHT11 (with code modification)
- **RTC**: DS1307 (other RTCs may require library changes)

---

## Version History

### Current Version

- Time display with quarter-second interpolation
- PTH display mode
- Time adjustment via rotary encoder
- LED indicators
- Serial debugging support

### Future Versions

- Brightness control
- 24-hour format option
- Date display mode
- EEPROM settings storage

