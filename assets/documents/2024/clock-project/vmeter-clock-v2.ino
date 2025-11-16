#include "Arduino.h" // Arduino stuff
#include "uRTCLib.h" // Real time clock stuff 
#include <Adafruit_Sensor.h> // Pressure sensor stuff
#include <Adafruit_BMP085_U.h> // Pressure sensor stuff
#include <DHT.h> // Humidity sensor stuff

// Create an instance of the BMP180 sensor
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10180); // BMP180 sensor object for pressure and temperature

uRTCLib rtc(0x68); // RTC object for handling real-time clock operations

// Pin assignments
const int hrPin = 9;         // PWM pin for hour display
const int minPin = 5;        // PWM pin for minute display
const int secPin = 6;        // PWM pin for second display
const int buttonPin = 4;     // Button pin for user interaction
const int dhtPin = 7;        // Pin connected to the DHT sensor
const int hrLedPin = 8;      // LED pin for hour adjustment indicator
const int minLedPin = 10;    // LED pin for minute adjustment indicator
const int secLedPin = 11;    // LED pin for second adjustment indicator
const int pthLedsPin = 12;   // LED pin for PTH (Pressure, Temperature, Humidity) display indicator

// DHT sensor setup
#define DHTPIN dhtPin
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Limit switch (rotary encoder) pin definitions
const int pinA = 2;          // Limit switch A (interrupt pin)
const int pinB = 3;          // Limit switch B (interrupt pin)

// Rotary encoder variables
int counter = 0;             // Counter for rotary encoder steps
volatile int A_prev = 0;     // Previous state of signal A
volatile int B_prev = 0;     // Previous state of signal B

// PWM output variables
int hrVal = 0;               // Hour PWM value
int minVal = 0;              // Minute PWM value
int secVal = 0;              // Second PWM value

int displayMode = 0;         // Current display mode (0 = time, 1 = PTH)

// Rotary encoder limits
const int minCounter = 0;    // Minimum value for counter
volatile int maxCounter; // Maximum value for counter

// Quarter-second variables
float quarterSecVal = 0;     // Quarter-second PWM adjustment value
int currentSec = 0;          // Current second
int startMillis = 0;         // Start time for quarter-second calculations
int dMillis = 0;             // Delta time for quarter-second logic

// BMP180 sensor data
float pressure = 0;          // Pressure reading in hPa
float temperature = 0;       // Temperature reading in °C

// DHT sensor data
float humidity = 0.0;        // Humidity reading in %
float dhtTemperature = 0;    // Temperature reading from DHT sensor in °F

// Debugging flag
bool debug_println = false;  // Enable or disable debug messages

// Timing variables for blinking LEDs
unsigned long previousMillisBlink = 0; // Last time LED on pin D11 blinked
const long blinkInterval = 500;     // Interval for blinking (in ms)
bool ledState = LOW;                 // Current state of the LED

// Serial communication timing
unsigned long previousMillisSerial = 0; // Last time serial data was printed

// Button press handling
const unsigned long longPressThreshold = 500; // Threshold for long press (in ms)
unsigned long buttonPressStart = 0;           // Time when button press started
bool buttonHeld = false;                      // Flag for button hold state
bool isAdjustingTime = false;                 // Flag for time adjustment mode
int currentAdjustmentStep = 3;                // Current adjustment step (Hour -> Minute -> Second -> Brightness (not used))

// Constants defining the expected range of sensor values for the voltmeter
const int minPressureVal = 950;  // Minimum pressure in hPa (covers extreme low-pressure weather)
const int maxPressureVal = 1030; // Maximum pressure in hPa (covers high-pressure weather conditions)
const int minTempVal = 40;       // Minimum temperature in °F 
const int maxTempVal = 100;      // Maximum temperature in °F
const int minRHVal = 0;          // Minimum relative humidity in % 
const int maxRHVal = 100;        // Maximum relative humidity in % 

// Play mode variables
bool playMode = false;                        // Flag for play mode state
unsigned long clickTimes[3] = {0, 0, 0};     // Array to store last 3 click timestamps for triple-click detection
int clickIndex = 0;                          // Current position in click times array
const unsigned long TRIPLE_CLICK_WINDOW = 500; // Maximum time window for triple-click detection (in ms)
unsigned long lastActivityTime = 0;           // Timestamp of last button or encoder activity in play mode
const unsigned long PLAY_MODE_TIMEOUT = 15000; // Timeout duration for play mode inactivity (15 seconds in ms)
int currentLEDPattern = 0;                    // Current binary LED pattern value (0-15, cycles through all combinations)
unsigned long lastLEDUpdate = 0;              // Last time LED pattern was updated
const unsigned long LED_UPDATE_INTERVAL = 300; // Interval for updating LED patterns (in ms)
int activeVoltmeter = 0;                     // Currently active voltmeter in play mode (0=hour, 1=minute, 2=second)
int lastEncoderCounter = 0;                   // Previous encoder counter value for detecting changes and activity

void setup() {

  Serial.begin(9600);
  URTCLIB_WIRE.begin();  // Ensure the RTC module is properly initialized

  // Set output pins to output mode (PWM pins)
  pinMode(hrPin, OUTPUT);
  pinMode(minPin, OUTPUT);
  pinMode(secPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);

  // Enable internal pull-up resistors and set the pins for input
  pinMode(pinA, INPUT_PULLUP);
  pinMode(pinB, INPUT_PULLUP);

  // Attach interrupts for pinA and pinB
  attachInterrupt(digitalPinToInterrupt(pinA), updateEncoderA, CHANGE);
  attachInterrupt(digitalPinToInterrupt(pinB), updateEncoderB, CHANGE);

  // Initialize previous states
  A_prev = digitalRead(pinA);
  B_prev = digitalRead(pinB);

    // Initialize BMP180 sensor
  if (!bmp.begin()) {
    Serial.println("Could not find a valid BMP180 sensor, check wiring!");
    while (1);
  }

  dht.begin();

}


void loop() {
  static bool lastButtonState = HIGH;
  bool buttonState = digitalRead(buttonPin);

  // Triple-click detection for entering play mode
  // Only active when not in time adjustment mode and not already in play mode
  bool tripleClickDetected = false;
  if (!isAdjustingTime && !playMode) {
    if (buttonState == LOW && lastButtonState == HIGH) {  // Button pressed
      unsigned long currentTime = millis();
      clickTimes[clickIndex] = currentTime;  // Record click timestamp
      clickIndex = (clickIndex + 1) % 3;      // Move to next position in circular array
      
      // Check if triple-click detected (3 clicks within 500ms window)
      // Only check if we have at least 3 clicks recorded
      if (clickTimes[0] != 0 && clickTimes[1] != 0 && clickTimes[2] != 0) {
        if (detectTripleClick()) {
          enterPlayMode();  // Enter play mode if triple-click detected
          tripleClickDetected = true;
        }
      }
    }
  }

  // Detect button press (short or long press)
  // Skip normal button handling if triple-click was just detected
  if (!tripleClickDetected && buttonState == LOW && lastButtonState == HIGH) {  // Button pressed
    if (debug_println)
      Serial.println("Button pressed");
    buttonPressStart = millis(); // Start measuring the press time
    buttonHeld = true;
    
    // Update activity time for play mode timeout tracking
    if (playMode) {
      lastActivityTime = millis();  // Reset inactivity timer on button press
    }
    
  } else if (buttonState == HIGH && lastButtonState == LOW) { // Button released
    if (debug_println)
      Serial.println("Button released");
    if (buttonHeld) {
      unsigned long pressDuration = millis() - buttonPressStart;

      if (pressDuration >= longPressThreshold) {
        if (debug_println)
          Serial.println("Started adjusting time");
        // Long press detected, enable time adjustment mode
        // Exit play mode if currently active (time adjustment takes priority)
        if (playMode) {
          exitPlayMode();
        }
        isAdjustingTime = true;
        currentAdjustmentStep = 0;  // Start with hour adjustment
        counter = int(rtc.hour() % 12);  // Initialize counter to current hour
      } else {
        if (isAdjustingTime == false) {
          if (playMode) {
            // In play mode, button press cycles through active voltmeter (hr -> min -> sec -> hr)
            handlePlayModeButton();
          } else {
            // Short press detected, toggle between display modes
            toggleDisplayMode(); // Toggle between time display and PTH display modes
          }
        }
      }
    }

    buttonHeld = false; // Reset buttonHeld state
  }

  lastButtonState = buttonState;

  // Play mode activity tracking and timeout
  // Track encoder changes for activity detection (resets inactivity timer)
  if (playMode && counter != lastEncoderCounter) {
    lastActivityTime = millis();  // Reset inactivity timer on encoder movement
    lastEncoderCounter = counter;  // Update tracked counter value
  }
  
  // Check for play mode timeout (15 seconds of inactivity)
  if (playMode) {
    if (millis() - lastActivityTime >= PLAY_MODE_TIMEOUT) {
      exitPlayMode();  // Exit play mode and return to normal time display
    }
  }

  // Adjust time if in adjustment mode
  if (isAdjustingTime) {
    adjustTime();  // Adjust time based on rotary encoder input and button presses
  }

  // Play mode handling (only active when not in time adjustment mode)
  if (playMode && !isAdjustingTime) {
    // Update play mode displays (LED patterns and voltmeter sweeps)
    updatePlayModeLEDs();        // Cycle through binary LED patterns
    updatePlayModeVoltmeters();   // Update voltmeter displays based on encoder input
  } else if (!isAdjustingTime) {
    // Normal operation - Read sensor data and update displays
    readHumidity(); // Read humidity and temperature data from the DHT sensor
    readPressure(); // Read pressure and temperature data from the BMP180 sensor
    blinkDisplaySerial(); // Blink serial output for debugging or display purposes

    // Update displays based on the current mode
    if (displayMode == 0) {
      updateTimeDisplay();  // Update the PWM displays for hours, minutes, and seconds
    }
    if (displayMode == 1) {
      updatePTH();  // Update the PWM displays for pressure, temperature, and humidity
    }
  }

  // Control LEDs based on display mode (only if not in play mode)
  // Play mode uses its own LED pattern cycling
  if (!playMode) {
    controlLEDsBasedOnDisplayMode(); // Control the LEDs to indicate the current mode
  }

  rtc.refresh();  // Refresh RTC data to ensure accurate time readings

  // Set rotary encoder limits based on the current mode
  if (playMode && !isAdjustingTime) {
    // In play mode, set limits for voltmeter sweep (0-255 PWM range)
    maxCounter = 255;  // Full PWM range for voltmeter control
  } else if (currentAdjustmentStep == 0) {
    maxCounter = 11;  // Limit counter to 11 for hours (12-hour format)
  } else if (currentAdjustmentStep == 1) {
    maxCounter = 59;  // Limit counter to 59 for minutes
  } else if (currentAdjustmentStep == 2) {
    maxCounter = 59;  // Limit counter to 59 for seconds
  } else if (currentAdjustmentStep == 3) {
    maxCounter = 20;  // Example: Set maximum brightness adjustment to 20 (NOT USED FEATURE YET)
  }
}

// Play mode functions

// Function to detect triple-click (3 clicks within 500ms window)
bool detectTripleClick() {
  // Check if we have 3 clicks recorded (all timestamps are non-zero)
  if (clickTimes[0] == 0 || clickTimes[1] == 0 || clickTimes[2] == 0) {
    return false; // Not enough clicks yet
  }
  
  // Find the oldest and newest click times from the recorded clicks
  unsigned long oldest = clickTimes[0];
  unsigned long newest = clickTimes[0];
  for (int i = 1; i < 3; i++) {
    if (clickTimes[i] < oldest) oldest = clickTimes[i];
    if (clickTimes[i] > newest) newest = clickTimes[i];
  }
  
  // Check if all 3 clicks are within the time window (500ms)
  return (newest - oldest) <= TRIPLE_CLICK_WINDOW;
}

// Function to enter play mode and initialize play mode state
void enterPlayMode() {
  playMode = true;                    // Set play mode flag
  lastActivityTime = millis();        // Initialize activity timer
  currentLEDPattern = 0;              // Start LED pattern from beginning
  activeVoltmeter = 0;                // Start with hour voltmeter active
  counter = 0;                        // Reset encoder counter
  lastEncoderCounter = 0;             // Initialize encoder tracking
  
  // Clear click times array for next triple-click detection
  for (int i = 0; i < 3; i++) {
    clickTimes[i] = 0;
  }
  clickIndex = 0;                     // Reset click index
  
  if (debug_println)
    Serial.println("Entered play mode");
}

// Function to exit play mode and return to normal operation
void exitPlayMode() {
  playMode = false;  // Clear play mode flag
  
  // Turn off all voltmeters (reset to zero)
  analogWrite(hrPin, 0);
  analogWrite(minPin, 0);
  analogWrite(secPin, 0);
  
  // Reset display mode to time mode (normal operation)
  displayMode = 0;
  
  if (debug_println)
    Serial.println("Exited play mode");
}

// Function to update LED patterns in play mode (cycles through binary patterns 0-15)
void updatePlayModeLEDs() {
  unsigned long currentMillis = millis();
  
  // Update LED pattern at regular intervals
  if (currentMillis - lastLEDUpdate >= LED_UPDATE_INTERVAL) {
    lastLEDUpdate = currentMillis;  // Save the current time
    
    // Cycle through binary patterns (0-15, representing all combinations of 4 LEDs)
    currentLEDPattern = (currentLEDPattern + 1) % 16;
    
    // Extract bits and set LEDs based on binary pattern
    // Bit 0 (value 1): hrLedPin (LSB)
    // Bit 1 (value 2): minLedPin
    // Bit 2 (value 4): secLedPin
    // Bit 3 (value 8, MSB): pthLedsPin
    digitalWrite(hrLedPin, (currentLEDPattern & 0x01) ? HIGH : LOW);
    digitalWrite(minLedPin, (currentLEDPattern & 0x02) ? HIGH : LOW);
    digitalWrite(secLedPin, (currentLEDPattern & 0x04) ? HIGH : LOW);
    digitalWrite(pthLedsPin, (currentLEDPattern & 0x08) ? HIGH : LOW);
  }
}

// Function to update voltmeter displays in play mode based on encoder counter value
void updatePlayModeVoltmeters() {
  // Use counter value directly for active voltmeter
  // Counter is already constrained to 0-255 by encoder interrupt handlers
  int pwmValue = constrain(counter, 0, 255);
  
  // Set active voltmeter to counter value (0-255), others to 0
  if (activeVoltmeter == 0) {
    analogWrite(hrPin, pwmValue);   // Display counter value on hour voltmeter
    analogWrite(minPin, 0);          // Turn off minute voltmeter
    analogWrite(secPin, 0);          // Turn off second voltmeter
  } else if (activeVoltmeter == 1) {
    analogWrite(hrPin, 0);           // Turn off hour voltmeter
    analogWrite(minPin, pwmValue);   // Display counter value on minute voltmeter
    analogWrite(secPin, 0);          // Turn off second voltmeter
  } else if (activeVoltmeter == 2) {
    analogWrite(hrPin, 0);           // Turn off hour voltmeter
    analogWrite(minPin, 0);          // Turn off minute voltmeter
    analogWrite(secPin, pwmValue);   // Display counter value on second voltmeter
  }
}

// Function to handle button press in play mode (cycles through active voltmeter)
void handlePlayModeButton() {
  // Cycle through active voltmeter: hr -> min -> sec -> hr
  activeVoltmeter = (activeVoltmeter + 1) % 3;
  counter = 0;  // Reset counter when switching voltmeters
  
  if (debug_println) {
    Serial.print("Active voltmeter: ");
    Serial.println(activeVoltmeter);
  }
}

void updateTimeDisplay() {
  if (debug_println)
  Serial.println("Time is displaying");

  hrVal = (rtc.hour() % 12 + rtc.minute() / 60.0) * 255.0 / 12;
  minVal = (rtc.minute() + rtc.second() / 60.0) * 255.0 / 60;

  // Handle quarter-second logic
  if (rtc.second() == currentSec) {
    handleQuarterSec();
  } else {
    currentSec = rtc.second();
    startMillis = millis();
    quarterSecVal = 0;
  }

  secVal = map(rtc.second(), 0, 60, 0, 255) + quarterSecVal;

  analogWrite(hrPin, hrVal);
  analogWrite(minPin, minVal);
  analogWrite(secPin, secVal);
}

// Function to handle quarter-second timing
void handleQuarterSec() {
  dMillis = millis() - startMillis;
  if (dMillis < 250) {
    quarterSecVal = 0;
  } else if (dMillis < 500) {
    quarterSecVal = 4.25 * 1 / 4;
  } else if (dMillis < 750) {
    quarterSecVal = 4.25 * 2 / 4;
  } else if (dMillis < 1000) {
    quarterSecVal = 4.25 * 3 / 4;
  } else {
    startMillis = millis();
    quarterSecVal = 0;
  }
}

void adjustTime() {
  if (debug_println)
  Serial.println("Time is being adjusted");
  static bool lastButtonState = HIGH;
  bool buttonState = digitalRead(buttonPin);

  if (buttonState == LOW && lastButtonState == HIGH) {  // Button pressed to confirm adjustment
    // Toggle between adjustment steps (Hour -> Minute -> Second -> Done)
    if (currentAdjustmentStep == 0) {
      rtc.set(0, 0, counter, 0, 0, 0, 0);  // Set hour
      currentAdjustmentStep = 1;  // Move to minute adjustment
      Serial.print("Hour set to: ");
      if (debug_println)
      Serial.println(counter);
    } else if (currentAdjustmentStep == 1) {
      rtc.set(0, counter, rtc.hour(), 0, 0, 0, 0);  // Set minute
      currentAdjustmentStep = 2;  // Move to second adjustment
      Serial.print("Minute set to: ");
      if (debug_println)
      Serial.println(counter);
    } else if (currentAdjustmentStep == 2) {
      rtc.set(counter, rtc.minute(), rtc.hour(), 0, 0, 0, 0);  // Set second
      isAdjustingTime = false;  // Finish time adjustment
      currentAdjustmentStep = 3;  // Reset to bulb brightness adjustment
      Serial.print("Second set to: ");
      if (debug_println)
      Serial.println(counter);
      displayMode = 1; // so it can toggle back to 0 after time setting
    }
  }

  lastButtonState = buttonState;

  // Show the current adjustment step on the display
  displayAdjustment();
  
}

void displayAdjustment() {
  if (debug_println)
  Serial.println("Displaying adjusted time in adjustment mode");
  // Display the current value of the counter (adjustment in progress)
  Serial.print("Adjusting: ");
  if (currentAdjustmentStep == 0) {
    Serial.print("Hour: ");
    analogWrite(hrPin, map(counter, 0, 12, 0, 255));
    analogWrite(minPin, 0);
    analogWrite(secPin, 0);
  } else if (currentAdjustmentStep == 1) {
    Serial.print("Minute: ");
    analogWrite(hrPin, 0);
    analogWrite(minPin, map(counter, 0, 60, 0, 255));
    analogWrite(secPin, 0);
  } else {
    Serial.print("Second: ");
    analogWrite(hrPin, 0);
    analogWrite(minPin, 0);
    analogWrite(secPin, map(counter, 0, 60, 0, 255));
  }
  Serial.println(counter);
}


void updateEncoderA() {
  int A = digitalRead(pinA);
  int B = digitalRead(pinB);

  if (A != A_prev) {  // A has changed
    if (A == LOW) {  // Falling edge of A
      if (B == HIGH) {
        counter++;  // Clockwise
      } else {
        counter--;  // Counter-clockwise
      }
    } else {  // Rising edge of A
      if (B == LOW) {
        if (counter != minCounter) counter++;  // Clockwise
      } else {
        if (counter != maxCounter) counter--;  // Counter-clockwise
      }
    }
    A_prev = A;
  }
  counter = constrain(counter, minCounter, maxCounter);
  if (debug_println)
  Serial.println(counter);
}

void updateEncoderB() {
  int A = digitalRead(pinA);
  int B = digitalRead(pinB);

  if (B != B_prev) {  // B has changed
    if (B == LOW) {  // Falling edge of B
      if (A == LOW) {
        counter++;  // Clockwise
      } else {
        counter--;  // Counter-clockwise
      }
    } else {  // Rising edge of B
      if (A == HIGH) {
        if (counter != minCounter) counter++;  // Clockwise with bump correction
      } else {
        if (counter != maxCounter) counter--;  // Counter-clockwise
      }
    }
    B_prev = B;
  }
  counter = constrain(counter, minCounter, maxCounter);
  if (debug_println)
  Serial.println(counter);
}

// Function to read pressure and temperature
void readPressure() {
  if (debug_println)
  Serial.println("Pressure data got");
  sensors_event_t event;
  bmp.getEvent(&event);

  if (event.pressure) {
    pressure = event.pressure; // Save pressure in hPa
    bmp.getTemperature(&temperature); // Save temperature in °C
  } else {
    pressure = -1; // Indicate failure to read pressure
    temperature = -1; // Indicate failure to read temperature
  }
}

void readHumidity() {
  if (debug_println)
  Serial.println("Humidity data got");
  humidity = dht.readHumidity();
  dhtTemperature = dht.readTemperature(true);//true=farenheight
  if (isnan(humidity) || isnan(dhtTemperature)) {
    Serial.println("Failed to read from DHT sensor!");
    humidity = -1;           // Error handling
    dhtTemperature = -1;     // Error handling
  }
}

void toggleDisplayMode() {
  if (debug_println)  
  Serial.println("Toggling display mode");
  displayMode = (displayMode == 0) ? 1 : 0;
  if (debug_println)
  Serial.print("Display mode toggled to: ");
  if (debug_println)
  Serial.println(displayMode);
}

// Function to update the Pressure, Temperature, Humidity (PTH) display
void updatePTH() {
  if (debug_println)
    Serial.println("PTH displaying");

  // Map pressure, temperature, and humidity readings to a PWM range (0-255)
  hrVal = map(pressure, minPressureVal, maxPressureVal, 0, 255);       // Map pressure in hPa to LED brightness
  minVal = map(dhtTemperature, minTempVal, maxTempVal, 0, 255);          // Map temperature in °F to LED brightness
  secVal = map(humidity, minRHVal, maxRHVal, 0, 255);                 // Map humidity in % to LED brightness

  // Constrain mapped values to the valid PWM range (0-255)
  hrVal = constrain(hrVal, 0, 255);  // Ensure pressure value is within the valid range
  minVal = constrain(minVal, 0, 255);  // Ensure temperature value is within the valid range
  secVal = constrain(secVal, 0, 255);  // Ensure humidity value is within the valid range

  // Output PWM signals to the respective pins
  analogWrite(hrPin, hrVal);   // Display pressure on the hour voltmeter
  analogWrite(minPin, minVal); // Display temperature on the minute voltmeter
  analogWrite(secPin, secVal); // Display humidity on the second voltmeter
}

void controlLEDsBasedOnDisplayMode() {
  if (!isAdjustingTime){
  if (displayMode == 0) {
    digitalWrite(hrLedPin, HIGH); 
    digitalWrite(minLedPin, HIGH); 
    digitalWrite(secLedPin, HIGH); 
    digitalWrite(pthLedsPin, LOW);
  } else if (displayMode == 1) {
    digitalWrite(hrLedPin, LOW); 
    digitalWrite(minLedPin, LOW); 
    digitalWrite(secLedPin, LOW); 
    digitalWrite(pthLedsPin, HIGH);
  }
  } 
  else if (isAdjustingTime){
    if (currentAdjustmentStep == 0){
      blinkPin(hrLedPin); 
      digitalWrite(minLedPin, LOW); 
      digitalWrite(secLedPin, LOW); 
      digitalWrite(pthLedsPin, LOW);

    } else if(currentAdjustmentStep == 1){
      digitalWrite(hrLedPin, LOW); 
      blinkPin(minLedPin); 
      digitalWrite(secLedPin, LOW); 
      digitalWrite(pthLedsPin, LOW);

    } else if(currentAdjustmentStep == 2){
      digitalWrite(hrLedPin, LOW); 
      digitalWrite(minLedPin, LOW); 
      blinkPin(secLedPin); 
      digitalWrite(pthLedsPin, LOW);

    }
  }
}

void blinkPin(int pin) {
  unsigned long currentMillis = millis();

  // Check if blinkInterval ms have passed
  if (currentMillis - previousMillisBlink >= blinkInterval) {
    previousMillisBlink = currentMillis;  // Save the current time
    if (debug_println)
    Serial.println("Blink!");

    // Toggle the LED state
    ledState = !ledState;  // Toggle the LED state
    digitalWrite(pin, ledState);  // Set the LED to the new state
  }
}

void blinkDisplaySerial(){
  unsigned long currentMillis = millis();

  // Check if blinkInterval ms have passed
  if (currentMillis - previousMillisSerial>= blinkInterval) {
    previousMillisSerial = currentMillis;  // Save the current time
    if (displayMode==0){
      Serial.print(rtc.hour());
      Serial.print(":");
      Serial.print(rtc.minute());
      Serial.print(":");
      Serial.println(rtc.second());
    }
    if (displayMode==1){
      Serial.print(pressure);
      Serial.print(" millibar, ");
      Serial.print(dhtTemperature);
      Serial.print(" degF, ");
      Serial.print(humidity);
      Serial.println(" %RH");

    }
  }
}

// Function to display debug information
void displayDebugInfo() {
  Serial.print("displaymode = ");
  Serial.print(displayMode);
  Serial.print("; AHr = ");
  Serial.print(hrVal);
  Serial.print("; AMin = ");
  Serial.print(minVal);
  Serial.print("; ASec = ");
  Serial.print(secVal);
  Serial.print("; A(.25)Sec = ");
  Serial.print(quarterSecVal);
  Serial.print("; dmillis = ");
  Serial.print(dMillis);
  Serial.print("; RTC.second = ");
  Serial.print(rtc.second());
  Serial.print("; Pressure = ");
  Serial.print(pressure);
  Serial.print(" hPa; DHT Humidity = ");
  Serial.print(humidity);
  Serial.print(" %; DHT Temperature = ");
  Serial.print(dhtTemperature);
  Serial.print(" °F; counter= ");
  Serial.println(dhtTemperature);
}

