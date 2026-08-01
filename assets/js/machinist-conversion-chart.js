// Behavior for /fraction-inch-mm-chart/. Depends on letterDrillSizes and
// numberDrillSizes from drill-sizes.js, and the gauge tables from
// gauge-sizes.js, both loaded first on that page.
(function() {
  // Gauge systems available, in display order. Each maps a gauge-number
  // string to a decimal-inch thickness/diameter; see gauge-sizes.js for
  // sourcing notes.
  const gaugeSystems = [
    { key: 'steel', label: 'Steel', table: steelGauge },
    { key: 'galvanized', label: 'Galv. Steel', table: galvanizedGauge },
    { key: 'stainless', label: 'Stainless', table: stainlessGauge },
    { key: 'aluminum', label: 'Aluminum', table: aluminumGauge },
    { key: 'zinc', label: 'Zinc', table: zincGauge },
    { key: 'awg', label: 'AWG (Wire)', table: awgGauge },
    { key: 'usstd', label: 'US Standard', table: usStdGauge },
  ];
  let enabledGaugeSystems = ['steel', 'awg'];

  // Build comprehensive fraction lookup
  const fractionLookup = new Map();

  // Add standard fractions (1/64 increments)
  for (let denom = 1; denom <= 64; denom *= 2) {
    for (let num = 0; num <= denom; num++) {
      const decimal = num / denom;
      if (decimal <= 1) {
        const key = Math.round(decimal * 100000) / 100000; // Round to avoid floating point issues
        if (!fractionLookup.has(key)) {
          fractionLookup.set(key, {
            fraction: num === 0 ? '0' : (num === denom ? '1' : `${num}/${denom}`),
            decimal: decimal
          });
        }
      }
    }
  }

  // Add common fractional increments
  for (let denom = 3; denom <= 64; denom++) {
    for (let num = 1; num < denom; num++) {
      const decimal = num / denom;
      if (decimal <= 1) {
        const key = Math.round(decimal * 100000) / 100000;
        if (!fractionLookup.has(key)) {
          // Find simplest form
          const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(num, denom);
          const simpleNum = num / divisor;
          const simpleDenom = denom / divisor;
          fractionLookup.set(key, {
            fraction: `${simpleNum}/${simpleDenom}`,
            decimal: decimal
          });
        }
      }
    }
  }

  function findExactLetterDrill(decimal) {
    // Check for exact match (within floating point precision)
    for (const [letter, size] of Object.entries(letterDrillSizes)) {
      if (Math.abs(size - decimal) < 0.000001) { // Exact match within floating point precision
        return letter;
      }
    }
    return null;
  }

  function findExactNumberDrill(decimal) {
    // Check for exact match (within floating point precision)
    for (const [number, size] of Object.entries(numberDrillSizes)) {
      if (Math.abs(size - decimal) < 0.000001) { // Exact match within floating point precision
        return number;
      }
    }
    return null;
  }

  // Find every enabled gauge system with an exact match at this decimal,
  // e.g. [{system: 'Steel', num: '16'}]. A given decimal can match more
  // than one system (several tables share numbering).
  function findExactGauges(decimal) {
    const matches = [];
    gaugeSystems.forEach(({ key, label, table }) => {
      if (!enabledGaugeSystems.includes(key)) {
        return;
      }
      for (const [num, size] of Object.entries(table)) {
        if (Math.abs(size - decimal) < 0.000001) {
          matches.push({ system: label, num });
          break;
        }
      }
    });
    return matches;
  }

  // Check if a fraction denominator is compatible with the step denominator
  function isCompatibleDenominator(denom, stepDenom) {
    // Check if denom is a factor of stepDenom or vice versa
    // For LCD compatibility, we want denominators that are powers of 2 up to stepDenom
    // or factors of stepDenom
    if (stepDenom % denom === 0) {
      return true;
    }
    // Also allow denominators that are powers of 2 (standard fractional system)
    let test = denom;
    while (test > 1 && test % 2 === 0) {
      test = test / 2;
    }
    if (test === 1 && denom <= stepDenom) {
      return true;
    }
    return false;
  }

  // Parse fraction string to get denominator
  function getDenominatorFromFraction(fractionStr) {
    if (fractionStr === '0' || fractionStr === '1') {
      return 1;
    }
    const parts = fractionStr.split('/');
    if (parts.length === 2) {
      return parseInt(parts[1]);
    }
    return null;
  }

  function decimalToFraction(decimal, isFractionInterval = false) {
    if (decimal < 0) {
      return '—';
    }

    // Helper function to simplify fractions
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

    // Helper function to format as mixed number
    const formatMixedNumber = (whole, num, den) => {
      if (whole === 0) {
        if (num === 0) return '0';
        // Simplify the fractional part
        const divisor = gcd(num, den);
        const simpleNum = num / divisor;
        const simpleDenom = den / divisor;
        return `${simpleNum}/${simpleDenom}`;
      } else {
        if (num === 0) {
          return whole.toString();
        }
        // Simplify the fractional part
        const divisor = gcd(num, den);
        const simpleNum = num / divisor;
        const simpleDenom = den / divisor;
        return `${whole} ${simpleNum}/${simpleDenom}`;
      }
    };

    // Only show fractions for exact matches or fraction intervals
    if (isFractionInterval) {
      // For fraction intervals, calculate the exact fraction based on step denominator
      const numerator = Math.round(decimal * intervalStepDenom);
      const calculated = numerator / intervalStepDenom;

      // Only return fraction if it's an exact match
      if (Math.abs(calculated - decimal) < 0.000001) {
        if (numerator === 0) {
          return '0';
        } else {
          const whole = Math.floor(numerator / intervalStepDenom);
          const remainder = numerator % intervalStepDenom;
          return formatMixedNumber(whole, remainder, intervalStepDenom);
        }
      }
    }

    // For non-interval values, check for exact matches in lookup
    const key = Math.round(decimal * 1000000) / 1000000;
    const entry = fractionLookup.get(key);

    if (entry) {
      const denom = getDenominatorFromFraction(entry.fraction);
      // Only return if it's an exact match and compatible
      if (denom && isCompatibleDenominator(denom, intervalStepDenom)) {
        // Verify it's truly exact by recalculating the fraction
        let fractionDecimal;
        if (entry.fraction === '0') {
          fractionDecimal = 0;
        } else if (entry.fraction === '1') {
          fractionDecimal = 1;
        } else {
          const parts = entry.fraction.split('/');
          if (parts.length === 2) {
            const num = parseInt(parts[0]);
            const den = parseInt(parts[1]);
            fractionDecimal = num / den;
          } else {
            fractionDecimal = parseFloat(entry.fraction);
          }
        }
        if (fractionDecimal !== undefined && Math.abs(fractionDecimal - decimal) < 0.000001) {
          // Convert to mixed number if >= 1
          if (fractionDecimal >= 1) {
            const whole = Math.floor(fractionDecimal);
            const fractionalPart = fractionDecimal - whole;
            if (fractionalPart === 0) {
              return whole.toString();
            }
            // Find the fractional part in the lookup
            const fracKey = Math.round(fractionalPart * 1000000) / 1000000;
            const fracEntry = fractionLookup.get(fracKey);
            if (fracEntry && fracEntry.fraction !== '0' && fracEntry.fraction !== '1') {
              const parts = fracEntry.fraction.split('/');
              if (parts.length === 2) {
                const num = parseInt(parts[0]);
                const den = parseInt(parts[1]);
                return formatMixedNumber(whole, num, den);
              }
            }
            // Fallback: calculate from decimal
            const fracNum = Math.round(fractionalPart * intervalStepDenom);
            const fracRemainder = fracNum % intervalStepDenom;
            if (fracRemainder === 0) {
              return whole.toString();
            }
            return formatMixedNumber(whole, fracRemainder, intervalStepDenom);
          } else {
            // Proper fraction (< 1)
            return entry.fraction;
          }
        }
      }
    }

    // Return dash if no exact match found
    return '—';
  }

  // State
  let enabledColumns = ['millimeters', 'inches', 'fractions', 'drill', 'gauge'];
  let intervalStart = 0;
  let intervalEnd = 1;
  let intervalStepDenom = 64; // Fraction denominator (e.g., 64 means 1/64)
  let intervalMMStep = 0.5; // Millimeter step (e.g., 0.5 means 0.5mm intervals)

  // Get step value from denominator
  function getStepValue(denom) {
    return 1 / denom;
  }

  // Generate data based on interval (first column) using fractional steps
  // Also includes millimeter interval values, letter drill sizes, and number drill sizes
  function getFilteredData() {
    const dataMap = new Map(); // Use Map to avoid duplicates by decimal value
    const step = getStepValue(intervalStepDenom);

    // Track which values are intervals (for bold formatting)
    const intervalValues = new Set();

    // 1. Generate fractional interval values
    let startSteps = Math.floor(intervalStart / step);
    let current = startSteps * step;

    if (current < intervalStart) {
      startSteps++;
      current = startSteps * step;
    }

    while (current <= intervalEnd + step / 1000) {
      const decimal = Math.round(current * 1000000) / 1000000;

      if (decimal >= intervalStart && decimal <= intervalEnd) {
        const key = decimal.toFixed(6);
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            decimal: decimal,
            fraction: decimalToFraction(decimal, true),
            millimeters: Math.round(decimal * 25.4 * 10000) / 10000,
            letterDrill: findExactLetterDrill(decimal),
            numberDrill: findExactNumberDrill(decimal),
            isFractionInterval: true,
            isMMInterval: false
          });
          intervalValues.add(key);
        } else {
          const entry = dataMap.get(key);
          entry.isFractionInterval = true;
          entry.fraction = decimalToFraction(decimal, true);
          intervalValues.add(key);
        }
      }

      startSteps++;
      current = startSteps * step;
    }

    // 2. Add millimeter interval values within range
    const minMM = intervalStart * 25.4;
    const maxMM = intervalEnd * 25.4;
    const mmStep = parseFloat(intervalMMStep);

    for (let mm = Math.ceil(minMM / mmStep) * mmStep; mm <= maxMM + mmStep / 1000; mm += mmStep) {
      const decimal = mm / 25.4;
      if (decimal >= intervalStart && decimal <= intervalEnd) {
        const key = decimal.toFixed(6);
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            decimal: Math.round(decimal * 1000000) / 1000000,
            fraction: decimalToFraction(decimal, false),
            millimeters: mm,
            letterDrill: findExactLetterDrill(decimal),
            numberDrill: findExactNumberDrill(decimal),
            isFractionInterval: false,
            isMMInterval: true
          });
          intervalValues.add(key);
        } else {
          const entry = dataMap.get(key);
          entry.millimeters = mm;
          entry.isMMInterval = true;
          entry.decimal = Math.round(decimal * 1000000) / 1000000;
          intervalValues.add(key);
          // Update drills if exact match
          const exactLetter = findExactLetterDrill(decimal);
          if (exactLetter) {
            entry.letterDrill = exactLetter;
          }
          const exactNumber = findExactNumberDrill(decimal);
          if (exactNumber) {
            entry.numberDrill = exactNumber;
          }
        }
      }
    }

    // 3. Add letter drill sizes within range
    for (const [letter, size] of Object.entries(letterDrillSizes)) {
      if (size >= intervalStart && size <= intervalEnd) {
        const key = size.toFixed(6);
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            decimal: Math.round(size * 1000000) / 1000000,
            fraction: decimalToFraction(size, false),
            millimeters: Math.round(size * 25.4 * 10000) / 10000,
            letterDrill: letter,
            numberDrill: findExactNumberDrill(size),
            isFractionInterval: false,
            isMMInterval: false
          });
          intervalValues.add(key);
        } else {
          const entry = dataMap.get(key);
          entry.letterDrill = letter;
          entry.decimal = Math.round(size * 1000000) / 1000000;
          intervalValues.add(key);
        }
      }
    }

    // 4. Add number drill sizes within range
    for (const [number, size] of Object.entries(numberDrillSizes)) {
      if (size >= intervalStart && size <= intervalEnd) {
        const key = size.toFixed(6);
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            decimal: Math.round(size * 1000000) / 1000000,
            fraction: decimalToFraction(size, false),
            millimeters: Math.round(size * 25.4 * 10000) / 10000,
            letterDrill: findExactLetterDrill(size),
            numberDrill: number,
            isFractionInterval: false,
            isMMInterval: false
          });
          intervalValues.add(key);
        } else {
          const entry = dataMap.get(key);
          entry.numberDrill = number;
          entry.decimal = Math.round(size * 1000000) / 1000000;
          intervalValues.add(key);
        }
      }
    }

    // 5. Add gauge sizes within range, for whichever systems are enabled
    gaugeSystems.forEach(({ key, table }) => {
      if (!enabledGaugeSystems.includes(key)) {
        return;
      }
      for (const [, size] of Object.entries(table)) {
        if (size >= intervalStart && size <= intervalEnd) {
          const dkey = size.toFixed(6);
          if (!dataMap.has(dkey)) {
            dataMap.set(dkey, {
              decimal: Math.round(size * 1000000) / 1000000,
              fraction: decimalToFraction(size, false),
              millimeters: Math.round(size * 25.4 * 10000) / 10000,
              letterDrill: findExactLetterDrill(size),
              numberDrill: findExactNumberDrill(size),
              isFractionInterval: false,
              isMMInterval: false
            });
          }
        }
      }
    });

    // Convert Map to array, resolve gauge matches now that every row that
    // could exist has been added, and sort by decimal value
    const data = Array.from(dataMap.values());
    data.forEach(item => {
      item.gauges = findExactGauges(item.decimal);
    });
    data.sort((a, b) => a.decimal - b.decimal);

    return data;
  }

  // Render chart
  function renderChart() {
    const header = document.getElementById('chart-header');
    const body = document.getElementById('chart-body');

    header.innerHTML = '';
    body.innerHTML = '';

    // Create header row
    const headerRow = document.createElement('tr');
    enabledColumns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      headerRow.appendChild(th);
    });
    header.appendChild(headerRow);

    // Get filtered data
    const data = getFilteredData();

    // Create body rows
    data.forEach(item => {
      const row = document.createElement('tr');

      // Check if this is a millimeter interval value
      const mmStep = parseFloat(intervalMMStep);
      const mmValue = item.millimeters;

      // Check if mm value is exactly on the interval grid
      let isMMInterval = false;
      if (item.isMMInterval) {
        // Verify it's actually on the interval (account for floating point precision)
        const normalized = mmValue / mmStep;
        const rounded = Math.round(normalized);
        isMMInterval = Math.abs(normalized - rounded) < 0.0001;
      }

      // Only bold fraction intervals and their decimals, and mm intervals
      const shouldBoldFraction = item.isFractionInterval;
      // Bold inches if it's a fraction interval OR if there's a drill match
      const shouldBoldInches = item.isFractionInterval || item.letterDrill || item.numberDrill;
      const shouldBoldMM = isMMInterval;

      enabledColumns.forEach(col => {
        const td = document.createElement('td');
        let value = '';
        let shouldBold = false;

        switch(col) {
          case 'fractions':
            value = item.fraction;
            // Only bold if it's a fraction interval
            shouldBold = shouldBoldFraction;
            break;
          case 'inches':
            value = item.decimal.toFixed(4);
            // Only bold if it's a fraction interval (same decimal as the fraction)
            shouldBold = shouldBoldInches;
            break;
          case 'drill':
            // Combine letter and number drills
            const drills = [];
            if (item.letterDrill) {
              drills.push(item.letterDrill);
            }
            if (item.numberDrill) {
              drills.push(item.numberDrill);
            }
            value = drills.length > 0 ? drills.join(', ') : '—';
            // Bold drills
            shouldBold = true;
            break;
          case 'gauge':
            value = item.gauges && item.gauges.length > 0
              ? item.gauges.map(g => `${g.num} ${g.system}`).join(', ')
              : '—';
            shouldBold = true;
            break;
          case 'millimeters':
            // Check if it's on the mm interval
            if (shouldBoldMM) {
              // Format based on step - if step is 1, show as integer; if 0.5, show one decimal, etc.
              if (mmStep >= 1) {
                value = Math.round(mmValue).toFixed(0);
              } else if (mmStep >= 0.1) {
                value = mmValue.toFixed(1);
              } else {
                value = mmValue.toFixed(2);
              }
              shouldBold = true;
            } else {
              // Not an interval, show full precision, don't bold
              value = mmValue.toFixed(4);
              shouldBold = false;
            }
            break;
        }

        td.textContent = value;
        // Don't bold dashes
        if (shouldBold && value !== '—') {
          td.style.fontWeight = 'bold';
        }
        row.appendChild(td);
      });

      body.appendChild(row);
    });
  }

  // Update interval display
  function updateIntervalDisplay() {
    document.getElementById('interval-start').value = intervalStart;
    document.getElementById('interval-start-input').value = intervalStart.toFixed(3);
    document.getElementById('interval-end').value = intervalEnd;
    document.getElementById('interval-end-input').value = intervalEnd.toFixed(3);
    document.getElementById('interval-step-denom').value = intervalStepDenom;
    const stepValue = getStepValue(intervalStepDenom);
    document.getElementById('interval-step-display').textContent = `= ${stepValue.toFixed(6)} in`;
    document.getElementById('interval-mm-step').value = intervalMMStep;
  }

  // Event listeners for interval sliders
  document.getElementById('interval-start').addEventListener('input', (e) => {
    intervalStart = parseFloat(e.target.value);
    if (intervalStart > intervalEnd) {
      intervalStart = intervalEnd;
      e.target.value = intervalStart;
    }
    updateIntervalDisplay();
    renderChart();
  });

  document.getElementById('interval-start-input').addEventListener('input', (e) => {
    intervalStart = parseFloat(e.target.value);
    if (intervalStart < 0) intervalStart = 0;
    if (intervalStart > 5) intervalStart = 5;
    if (intervalStart > intervalEnd) {
      intervalStart = intervalEnd;
    }
    updateIntervalDisplay();
    renderChart();
  });

  document.getElementById('interval-end').addEventListener('input', (e) => {
    intervalEnd = parseFloat(e.target.value);
    if (intervalEnd < intervalStart) {
      intervalEnd = intervalStart;
      e.target.value = intervalEnd;
    }
    updateIntervalDisplay();
    renderChart();
  });

  document.getElementById('interval-end-input').addEventListener('input', (e) => {
    intervalEnd = parseFloat(e.target.value);
    if (intervalEnd < 0) intervalEnd = 0;
    if (intervalEnd > 5) intervalEnd = 5;
    if (intervalEnd < intervalStart) {
      intervalEnd = intervalStart;
    }
    updateIntervalDisplay();
    renderChart();
  });

  document.getElementById('interval-step-denom').addEventListener('change', (e) => {
    intervalStepDenom = parseInt(e.target.value);
    updateIntervalDisplay();
    renderChart();
  });

  document.getElementById('interval-mm-step').addEventListener('change', (e) => {
    intervalMMStep = parseFloat(e.target.value);
    updateIntervalDisplay();
    renderChart();
  });

  // Event listeners for gauge system checkboxes
  gaugeSystems.forEach(({ key }) => {
    const checkbox = document.getElementById(`cb-gauge-${key}`);
    if (!checkbox) {
      return;
    }
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!enabledGaugeSystems.includes(key)) {
          enabledGaugeSystems.push(key);
        }
      } else {
        enabledGaugeSystems = enabledGaugeSystems.filter(k => k !== key);
      }
      renderChart();
    });
  });

  // Initialize
  updateIntervalDisplay();
  renderChart();
})();
