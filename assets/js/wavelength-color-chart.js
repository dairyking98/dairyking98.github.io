// Behavior for /wavelength-color-chart/. Depends on wavelengthColors from
// wavelength-colors.js, loaded first on that page.
(function () {
  const MIN_NM = 380;
  const MAX_NM = 750;

  // Approximate common-convention color-name bands. Unlike the CIE-derived
  // colors themselves, these boundaries aren't a rigorous standard -- named
  // spectral color ranges are inherently fuzzy/perceptual and vary by
  // source; these are widely-cited round-number approximations.
  const regions = [
    { max: 449, name: 'Violet' },
    { max: 484, name: 'Blue' },
    { max: 499, name: 'Cyan' },
    { max: 564, name: 'Green' },
    { max: 589, name: 'Yellow' },
    { max: 624, name: 'Orange' },
    { max: MAX_NM, name: 'Red' },
  ];

  function regionFor(nm) {
    for (const r of regions) {
      if (nm <= r.max) {
        return r.name;
      }
    }
    return regions[regions.length - 1].name;
  }

  // Build the gradient bar from the precomputed per-nm color table
  const gradientBar = document.getElementById('wavelength-gradient-bar');
  const stops = [];
  for (let nm = MIN_NM; nm <= MAX_NM; nm++) {
    const pct = ((nm - MIN_NM) / (MAX_NM - MIN_NM)) * 100;
    stops.push(`${wavelengthColors[nm]} ${pct.toFixed(3)}%`);
  }
  gradientBar.style.background = `linear-gradient(to right, ${stops.join(', ')})`;

  // Build tick marks
  const tickValues = [380, 400, 450, 500, 550, 600, 650, 700, 750];
  const ticksContainer = document.getElementById('wavelength-ticks');
  tickValues.forEach((nm) => {
    const pct = ((nm - MIN_NM) / (MAX_NM - MIN_NM)) * 100;
    const tick = document.createElement('div');
    tick.className = 'tick';
    tick.style.left = `${pct}%`;
    tick.textContent = nm;
    ticksContainer.appendChild(tick);
  });

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  const slider = document.getElementById('wavelength-slider');
  const swatch = document.getElementById('wavelength-swatch');
  const label = document.getElementById('wavelength-label');
  const regionLabel = document.getElementById('wavelength-region');
  const hexLabel = document.getElementById('wavelength-hex');
  const rgbLabel = document.getElementById('wavelength-rgb');

  function update() {
    const nm = parseInt(slider.value, 10);
    const hex = wavelengthColors[nm];
    const { r, g, b } = hexToRgb(hex);
    swatch.style.backgroundColor = hex;
    label.textContent = `${nm} nm`;
    regionLabel.textContent = regionFor(nm);
    hexLabel.textContent = hex.toUpperCase();
    rgbLabel.textContent = `RGB(${r}, ${g}, ${b})`;
  }

  slider.addEventListener('input', update);

  // Initialize
  update();
})();
