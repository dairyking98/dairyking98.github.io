---
layout: single
title: "Wavelength / Color Chart"
permalink: /wavelength-color-chart/
description: Interactive visible-light wavelength to color chart, built from real CIE 1931 color-matching data
author_profile: false
---

<div id="wavelength-chart-wrap">
  <div style="text-align: center; margin-bottom: 1.5rem;">
    <div id="wavelength-swatch"></div>
    <div id="wavelength-label" style="font-size: 2rem; font-weight: bold; margin-top: 0.75rem;">555 nm</div>
    <div id="wavelength-region" style="opacity: 0.7;">Green</div>
    <div id="wavelength-codes" style="margin-top: 0.5rem; font-family: monospace; font-size: 1.1rem; opacity: 0.85;">
      <span id="wavelength-hex">#3dc300</span>
      &nbsp;&middot;&nbsp;
      <span id="wavelength-rgb">RGB(61, 195, 0)</span>
    </div>
  </div>

  <div id="wavelength-slider-wrap">
    <div id="wavelength-gradient-bar"></div>
    <div id="wavelength-ticks"></div>
    <input type="range" id="wavelength-slider" min="380" max="750" step="1" value="555" aria-label="Wavelength in nanometers">
  </div>
</div>

<script src="{{ '/assets/js/wavelength-colors.js' | relative_url }}"></script>
<script src="{{ '/assets/js/wavelength-color-chart.js' | relative_url }}"></script>

<div class="notice--info">
  <strong>Data Sources:</strong> Colors are computed from the real <strong>CIE 1931 2&deg; standard observer</strong> color-matching
  functions at native 1&nbsp;nm resolution (no interpolation), using the Stockman &amp; Sharpe compilation hosted by the Color
  and Vision Research Laboratory (CVRL, UCL) &mdash; the standard reference dataset for this data, not an analytic approximation.
  Each wavelength's XYZ value is converted to linear sRGB via the standard D65 matrix (IEC 61966-2-1), out-of-gamut components are
  clipped to zero, and the whole spectrum is scaled by a single global factor (not per-wavelength) so relative brightness between
  wavelengths is preserved before sRGB gamma encoding. That's why violet and deep red genuinely look dim near the ends of the bar
  rather than fully saturated &mdash; that dimming is physically correct human luminous sensitivity, not a rendering shortfall, and
  it's the main thing most "rainbow gradient" wavelength charts get wrong by normalizing each color independently.
  <br><br>
  380&ndash;750&nbsp;nm is used as the visible range; unlike the color math itself, the exact cutoffs and the named color-region
  boundaries (violet/blue/cyan/green/yellow/orange/red) are common convention, not a fixed standard &mdash; visual sensitivity fades
  gradually rather than stopping at a sharp edge, and different sources place these boundaries tens of nm apart.
</div>
