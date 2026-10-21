// Behavior for /clearance-hole-chart/: the clearance hole table plus the
// ASME Y14.5 Appendix B positional tolerance calculator below it.
(function () {
  const FITS = ['close', 'normal', 'loose'];
  const FIT_LABELS = { close: 'Close', normal: 'Normal', loose: 'Loose' };

  // Inch clearance holes, ASME B18.2.8-1999 Table 2, transcribed exactly
  // (drill designation, hole min, hole max). Covers #0 through 1-1/2 in,
  // which is the standard's full stated scope (Sec. 1).
  // Format: [Screw Size, Nominal Diameter (in), Close, Normal, Loose]
  const inchHoles = [
    ['#0', 0.0600, ['#51', 0.067, 0.071], ['#48', 0.076, 0.082], ['3/32', 0.094, 0.104]],
    ['#1', 0.0730, ['#46', 0.081, 0.085], ['#43', 0.089, 0.095], ['#37', 0.104, 0.114]],
    ['#2', 0.0860, ['3/32', 0.094, 0.098], ['#38', 0.102, 0.108], ['#32', 0.116, 0.126]],
    ['#3', 0.0990, ['#36', 0.106, 0.110], ['#32', 0.116, 0.122], ['#30', 0.128, 0.140]],
    ['#4', 0.1120, ['#31', 0.120, 0.124], ['#30', 0.128, 0.135], ['#27', 0.144, 0.156]],
    ['#5', 0.1250, ['9/64', 0.141, 0.146], ['5/32', 0.156, 0.163], ['11/64', 0.172, 0.184]],
    ['#6', 0.1380, ['#23', 0.154, 0.159], ['#18', 0.170, 0.177], ['#13', 0.185, 0.197]],
    ['#8', 0.1640, ['#15', 0.180, 0.185], ['#9', 0.196, 0.203], ['#3', 0.213, 0.225]],
    ['#10', 0.1900, ['#5', 0.206, 0.211], ['#2', 0.221, 0.228], ['B', 0.238, 0.250]],
    ['1/4', 0.2500, ['17/64', 0.266, 0.272], ['9/32', 0.281, 0.290], ['19/64', 0.297, 0.311]],
    ['5/16', 0.3125, ['21/64', 0.328, 0.334], ['11/32', 0.344, 0.354], ['23/64', 0.359, 0.373]],
    ['3/8', 0.3750, ['25/64', 0.391, 0.397], ['13/32', 0.406, 0.416], ['27/64', 0.422, 0.438]],
    ['7/16', 0.4375, ['29/64', 0.453, 0.460], ['15/32', 0.469, 0.479], ['31/64', 0.484, 0.500]],
    ['1/2', 0.5000, ['17/32', 0.531, 0.538], ['9/16', 0.562, 0.572], ['39/64', 0.609, 0.625]],
    ['5/8', 0.6250, ['21/32', 0.656, 0.663], ['11/16', 0.688, 0.698], ['47/64', 0.734, 0.754]],
    ['3/4', 0.7500, ['25/32', 0.781, 0.789], ['13/16', 0.812, 0.824], ['29/32', 0.906, 0.926]],
    ['7/8', 0.8750, ['29/32', 0.906, 0.914], ['15/16', 0.938, 0.950], ['1 1/32', 1.031, 1.051]],
    ['1', 1.0000, ['1 1/32', 1.031, 1.039], ['1 3/32', 1.094, 1.106], ['1 5/32', 1.156, 1.181]],
    ['1 1/8', 1.1250, ['1 5/32', 1.156, 1.164], ['1 7/32', 1.219, 1.235], ['1 5/16', 1.312, 1.337]],
    ['1 1/4', 1.2500, ['1 9/32', 1.281, 1.291], ['1 11/32', 1.344, 1.360], ['1 7/16', 1.438, 1.463]],
    ['1 3/8', 1.3750, ['1 7/16', 1.438, 1.448], ['1 1/2', 1.500, 1.516], ['1 39/64', 1.609, 1.634]],
    ['1 1/2', 1.5000, ['1 9/16', 1.562, 1.572], ['1 5/8', 1.625, 1.641], ['1 47/64', 1.734, 1.759]],
  ];

  // Metric clearance holes, ASME B18.2.8-1999 Table 3 (which the standard
  // states agrees with ISO 273). The nominal drill is the hole minimum in
  // every row, so only min/max are stored.
  // Format: [Screw Size, Nominal Diameter (mm), Close, Normal, Loose]
  const metricHoles = [
    ['M1.6', 1.6, [1.7, 1.8], [1.8, 1.94], [2, 2.25]],
    ['M2', 2, [2.2, 2.3], [2.4, 2.54], [2.6, 2.85]],
    ['M2.5', 2.5, [2.7, 2.8], [2.9, 3.04], [3.1, 3.4]],
    ['M3', 3, [3.2, 3.32], [3.4, 3.58], [3.6, 3.9]],
    ['M4', 4, [4.3, 4.42], [4.5, 4.68], [4.8, 5.1]],
    ['M5', 5, [5.3, 5.42], [5.5, 5.68], [5.8, 6.1]],
    ['M6', 6, [6.4, 6.55], [6.6, 6.82], [7, 7.36]],
    ['M8', 8, [8.4, 8.55], [9, 9.22], [10, 10.36]],
    ['M10', 10, [10.5, 10.68], [11, 11.27], [12, 12.43]],
    ['M12', 12, [13, 13.18], [13.5, 13.77], [14.5, 14.93]],
    ['M14', 14, [15, 15.18], [15.5, 15.77], [16.5, 16.93]],
    ['M16', 16, [17, 17.18], [17.5, 17.77], [18.5, 19.02]],
    ['M20', 20, [21, 21.21], [22, 22.33], [24, 24.52]],
    ['M24', 24, [25, 25.21], [26, 26.33], [28, 28.52]],
    ['M30', 30, [31, 31.25], [33, 33.39], [35, 35.62]],
    ['M36', 36, [37, 37.25], [39, 39.39], [42, 42.62]],
    ['M42', 42, [43, 43.25], [45, 45.39], [48, 48.62]],
    ['M48', 48, [50, 50.25], [52, 52.46], [56, 56.74]],
    ['M56', 56, [58, 58.3], [62, 62.46], [66, 66.74]],
    ['M64', 64, [66, 66.3], [70, 70.46], [74, 74.74]],
    ['M72', 72, [74, 74.3], [78, 78.46], [82, 82.87]],
    ['M80', 80, [82, 82.35], [86, 86.54], [91, 91.87]],
    ['M90', 90, [93, 93.35], [96, 96.54], [101, 101.87]],
    ['M100', 100, [104, 104.35], [107, 107.54], [112, 112.87]],
  ];

  // Normalize both tables to one shape: { size, nominal, fits: { close: { drill, min, max }, ... } }
  function getRows(system) {
    if (system === 'inch') {
      return inchHoles.map(([size, nominal, ...fits]) => ({
        size,
        nominal,
        fits: Object.fromEntries(FITS.map((fit, i) => {
          const [drill, min, max] = fits[i];
          return [fit, { drill, min, max }];
        })),
      }));
    }
    return metricHoles.map(([size, nominal, ...fits]) => ({
      size,
      nominal,
      fits: Object.fromEntries(FITS.map((fit, i) => {
        const [min, max] = fits[i];
        return [fit, { drill: `${min} mm`, min, max }];
      })),
    }));
  }

  // Unit helpers. Inch values print to 3 places (as B18.2.8 does) and
  // tolerances to 4; metric values print to 2 and tolerances to 3.
  function unit(system) {
    return system === 'inch' ? 'in' : 'mm';
  }
  function fmt(value, system, extra = 0) {
    return value.toFixed((system === 'inch' ? 3 : 2) + extra);
  }
  function convert(value, system) {
    return system === 'inch'
      ? `${(value * 25.4).toFixed(2)} mm`
      : `${(value / 25.4).toFixed(4)} in`;
  }

  // ---- Chart ----

  let chartSystem = 'inch';
  let enabledFits = ['close', 'normal', 'loose'];
  let showConverted = false;
  let showPosition = false;

  function renderChart() {
    const header = document.getElementById('chart-header');
    const body = document.getElementById('chart-body');
    header.innerHTML = '';
    body.innerHTML = '';

    const headerRow = document.createElement('tr');
    const labels = ['Screw Size', 'Nominal Diameter'].concat(
      FITS.filter((fit) => enabledFits.includes(fit)).map((fit) => `${FIT_LABELS[fit]} Fit`)
    );
    labels.forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headerRow.appendChild(th);
    });
    header.appendChild(headerRow);

    const u = unit(chartSystem);
    getRows(chartSystem).forEach((row) => {
      const tr = document.createElement('tr');

      const sizeTd = document.createElement('td');
      sizeTd.textContent = row.size;
      tr.appendChild(sizeTd);

      const nominalTd = document.createElement('td');
      const nominalParts = [`${row.nominal.toFixed(chartSystem === 'inch' ? 4 : 1)} ${u}`];
      if (showConverted) {
        nominalParts.push(convert(row.nominal, chartSystem));
      }
      nominalTd.innerHTML = nominalParts.join('<br>');
      tr.appendChild(nominalTd);

      FITS.filter((fit) => enabledFits.includes(fit)).forEach((fit) => {
        const hole = row.fits[fit];
        const td = document.createElement('td');
        const parts = [];
        // Metric drills are the hole minimum, so the drill line would just
        // repeat it; only inch rows get a separate drill designation line.
        if (chartSystem === 'inch') {
          parts.push(`<strong>${hole.drill}</strong>`);
        }
        parts.push(`${fmt(hole.min, chartSystem)}&ndash;${fmt(hole.max, chartSystem)} ${u}`);
        if (showConverted) {
          parts.push(chartSystem === 'inch'
            ? `${(hole.min * 25.4).toFixed(2)}&ndash;${(hole.max * 25.4).toFixed(2)} mm`
            : `${(hole.min / 25.4).toFixed(4)}&ndash;${(hole.max / 25.4).toFixed(4)} in`);
        }
        if (showPosition) {
          // Y14.5 Appendix B with F = nominal diameter (see page notes)
          const floating = hole.min - row.nominal;
          parts.push(`<span class="clearance-chart__tol">&#8982; &Oslash;${fmt(floating, chartSystem, 1)} float / &Oslash;${fmt(floating / 2, chartSystem, 1)} fixed</span>`);
        }
        td.innerHTML = parts.join('<br>');
        tr.appendChild(td);
      });

      body.appendChild(tr);
    });
  }

  document.getElementById('chart-system-select').addEventListener('change', (e) => {
    chartSystem = e.target.value;
    document.getElementById('cb-show-converted-label').textContent =
      chartSystem === 'inch' ? 'Show Millimeters' : 'Show Inches';
    renderChart();
  });

  FITS.forEach((fit) => {
    document.getElementById(`cb-fit-${fit}`).addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!enabledFits.includes(fit)) {
          enabledFits.push(fit);
        }
      } else {
        enabledFits = enabledFits.filter((f) => f !== fit);
      }
      renderChart();
    });
  });

  document.getElementById('cb-show-converted').addEventListener('change', (e) => {
    showConverted = e.target.checked;
    renderChart();
  });

  document.getElementById('cb-show-position').addEventListener('change', (e) => {
    showPosition = e.target.checked;
    renderChart();
  });

  // ---- Positional tolerance calculator ----

  const calc = {
    system: document.getElementById('calc-system-select'),
    size: document.getElementById('calc-size-select'),
    fit: document.getElementById('calc-fit-select'),
    fastener: document.getElementById('calc-fastener'),
    hole: document.getElementById('calc-hole'),
    t1: document.getElementById('calc-t1'),
    tilt: document.getElementById('cb-calc-tilt'),
    tiltInputs: document.getElementById('calc-tilt-inputs'),
    p: document.getElementById('calc-p'),
    d: document.getElementById('calc-d'),
    target: document.getElementById('calc-target'),
    results: document.getElementById('calc-results'),
    reverse: document.getElementById('calc-reverse-results'),
  };

  function currentRow() {
    return getRows(calc.system.value)[parseInt(calc.size.value, 10)];
  }

  function populateSizes() {
    const rows = getRows(calc.system.value);
    calc.size.innerHTML = rows.map((row, i) => `<option value="${i}">${row.size}</option>`).join('');
    // Land on a common mid-range size rather than the smallest one
    const defaultSize = calc.system.value === 'inch' ? '1/4' : 'M6';
    calc.size.value = String(rows.findIndex((row) => row.size === defaultSize));
    document.querySelectorAll('.calc-unit').forEach((el) => {
      el.textContent = unit(calc.system.value);
    });
  }

  // Pull F and H from the table for the chosen size/fit. Both stay editable,
  // and choosing "Custom" leaves H alone so a nonstandard hole can be entered.
  function fillFromTable() {
    const row = currentRow();
    const system = calc.system.value;
    calc.fastener.value = row.nominal.toFixed(system === 'inch' ? 4 : 2);
    if (calc.fit.value !== 'custom') {
      calc.hole.value = fmt(row.fits[calc.fit.value].min, system);
    }
  }

  function line(label, value, note) {
    return `<tr><th scope="row">${label}</th><td>${value}</td><td>${note || ''}</td></tr>`;
  }

  function renderCalc() {
    const system = calc.system.value;
    const u = unit(system);
    const F = parseFloat(calc.fastener.value);
    const H = parseFloat(calc.hole.value);
    const tol = (t) => (t >= 0
      ? `&Oslash;${fmt(t, system, 1)} ${u}`
      : '<span class="clearance-calc__bad">none: hole is smaller than F</span>');

    if (!(F > 0) || !(H > 0)) {
      calc.results.innerHTML = '<p>Enter a fastener diameter and a hole diameter.</p>';
    } else {
      const floating = H - F;
      const fixed = floating / 2;
      let rows = line('Floating fastener', tol(floating), 'T = H &minus; F, each part');
      rows += line('Fixed fastener', tol(fixed), 'T = (H &minus; F) / 2, each part');

      // Unequal split between the clearance-hole part (T1) and the tapped
      // part (T2): H = F + T1 + T2, or with tilt allowance when no projected
      // tolerance zone is used, H = F + T1 + T2(1 + 2P/D).
      const T1 = parseFloat(calc.t1.value);
      if (T1 >= 0) {
        let T2;
        let formula;
        if (calc.tilt.checked) {
          const P = parseFloat(calc.p.value);
          const D = parseFloat(calc.d.value);
          if (P > 0 && D > 0) {
            T2 = (floating - T1) / (1 + (2 * P) / D);
            formula = 'T&#8322; = (H &minus; F &minus; T&#8321;) / (1 + 2P/D), no projected zone';
          }
        } else {
          T2 = floating - T1;
          formula = 'T&#8322; = H &minus; F &minus; T&#8321;, projected zone on the tapped hole';
        }
        if (T2 !== undefined) {
          rows += line('Fixed, tapped part (T&#8322;)', tol(T2), formula);
        }
      }
      calc.results.innerHTML = `<table class="clearance-calc__table"><tbody>${rows}</tbody></table>`;
    }

    // Reverse direction: the smallest hole a target positional tolerance
    // needs, and the tightest standard fit for this size that provides it.
    const T = parseFloat(calc.target.value);
    if (!(F > 0) || !(T > 0)) {
      calc.reverse.innerHTML = '';
      return;
    }
    const row = currentRow();
    const smallestFit = (hMin) => {
      const fit = FITS.find((f) => row.fits[f].min >= hMin - 1e-9);
      if (!fit) {
        return 'larger than the Loose fit; no standard hole for this size';
      }
      const hole = row.fits[fit];
      const drill = system === 'inch' ? `${hole.drill} drill, ` : '';
      return `${FIT_LABELS[fit]} fit (${drill}${fmt(hole.min, system)} ${u} min)`;
    };
    const floatH = F + T;
    const fixedH = F + 2 * T;
    calc.reverse.innerHTML = `<table class="clearance-calc__table"><tbody>
      ${line('Floating fastener', `H &ge; ${fmt(floatH, system, 1)} ${u}`, smallestFit(floatH))}
      ${line('Fixed fastener', `H &ge; ${fmt(fixedH, system, 1)} ${u}`, smallestFit(fixedH))}
    </tbody></table>`;
  }

  calc.system.addEventListener('change', () => {
    populateSizes();
    fillFromTable();
    calc.t1.value = '';
    calc.target.value = '';
    renderCalc();
  });
  calc.size.addEventListener('change', () => {
    fillFromTable();
    renderCalc();
  });
  calc.fit.addEventListener('change', () => {
    fillFromTable();
    renderCalc();
  });
  calc.hole.addEventListener('input', () => {
    // Typing a hole size by hand makes it a custom hole
    calc.fit.value = 'custom';
    renderCalc();
  });
  calc.tilt.addEventListener('change', () => {
    calc.tiltInputs.style.display = calc.tilt.checked ? 'flex' : 'none';
    renderCalc();
  });
  [calc.fastener, calc.t1, calc.p, calc.d, calc.target].forEach((el) => {
    el.addEventListener('input', renderCalc);
  });

  renderChart();
  populateSizes();
  fillFromTable();
  renderCalc();
})();
