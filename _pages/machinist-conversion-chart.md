---
layout: single
title: "Machinist Conversion Chart"
permalink: /machinist-conversion-chart/
description: Interactive conversion chart for fractions, inches, millimeters, letter/number drills, and sheet/wire gauge
author_profile: false
---

<div id="chart-controls" style="margin-bottom: 2rem;">
  <div id="interval-controls" style="margin-bottom: 1rem;">
    <h3>Interval Settings</h3>
    <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: center;">
      <div>
        <label for="interval-start">Start:</label>
        <input type="range" id="interval-start" min="0" max="5" step="0.001" value="0" style="width: 200px;">
        <input type="number" id="interval-start-input" min="0" max="5" step="0.001" value="0" style="width: 80px; margin-left: 0.5rem;">
        <span>in</span>
      </div>
      <div>
        <label for="interval-end">End:</label>
        <input type="range" id="interval-end" min="0" max="5" step="0.001" value="1" style="width: 200px;">
        <input type="number" id="interval-end-input" min="0" max="5" step="0.001" value="1" style="width: 80px; margin-left: 0.5rem;">
        <span>in</span>
      </div>
      <div>
        <label for="interval-step-denom">Step (Fraction Denominator):</label>
        <select id="interval-step-denom" style="width: 120px; margin-left: 0.5rem;">
          <option value="2">1/2 (0.5)</option>
          <option value="4">1/4 (0.25)</option>
          <option value="8">1/8 (0.125)</option>
          <option value="16">1/16 (0.0625)</option>
          <option value="32">1/32 (0.03125)</option>
          <option value="64" selected>1/64 (0.015625)</option>
          <option value="128">1/128 (0.0078125)</option>
        </select>
        <span id="interval-step-display" style="margin-left: 0.5rem;">= 0.015625 in</span>
      </div>
      <div>
        <label for="interval-mm-step">Step (Millimeters):</label>
        <select id="interval-mm-step" style="width: 120px; margin-left: 0.5rem;">
          <option value="0.01">0.01 mm</option>
          <option value="0.05">0.05 mm</option>
          <option value="0.1">0.1 mm</option>
          <option value="0.5" selected>0.5 mm</option>
          <option value="1">1 mm</option>
          <option value="2">2 mm</option>
          <option value="5">5 mm</option>
          <option value="10">10 mm</option>
        </select>
      </div>
    </div>
  </div>
  <div id="gauge-controls">
    <h3>Gauge Systems</h3>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-steel">
        <span>Steel (Mfr Std)</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-galvanized">
        <span>Galvanized Steel</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-stainless">
        <span>Stainless Steel</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-aluminum">
        <span>Aluminum (B&amp;S)</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-zinc">
        <span>Zinc</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-awg">
        <span>Wire (AWG)</span>
      </label>
      <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
        <input type="checkbox" id="cb-gauge-usstd">
        <span>US Standard</span>
      </label>
    </div>
  </div>
</div>

<div id="chart-container" style="overflow-x: auto;">
  <table id="conversion-chart">
    <thead id="chart-header"></thead>
    <tbody id="chart-body"></tbody>
  </table>
</div>

<script src="{{ '/assets/js/drill-sizes.js' | relative_url }}"></script>
<script src="{{ '/assets/js/gauge-sizes.js' | relative_url }}"></script>
<script src="{{ '/assets/js/machinist-conversion-chart.js' | relative_url }}"></script>

<div class="notice--info">
  <strong>Data Sources:</strong> Letter and number drill decimal sizes are read from <strong>ASME B94.11M-1993</strong> ("Twist Drills"),
  Table 1 &mdash; verified directly against the standard's own table, not a secondary reference.
  <br><br>
  Gauge numbering (Steel, Galvanized Steel, Stainless Steel, Aluminum, Zinc, AWG) is <em>not</em> an ASME or ISO standard &mdash; ASTM
  explicitly discourages its use ("an archaic term of limited usefulness not having general agreement on meaning," ASTM A480/A480M) &mdash;
  and neither ASME nor ISO publishes a gauge-number table. These values are Machinery's Handbook (Oberg) figures, read from the raw
  source tables directly rather than a paraphrased summary. The one exception with real legal weight is <strong>US Standard Gauge</strong>,
  which is defined by U.S. federal statute, 15 U.S.C. &sect;&nbsp;206. Aluminum sheet and AWG wire share the same Brown &amp; Sharpe (B&amp;S)
  numbering, listed as separate systems here since they're commonly looked up separately.
</div>

