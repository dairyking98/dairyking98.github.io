---
layout: single
title: "Fraction / Inch / Millimeter Chart"
permalink: /fraction-inch-mm-chart/
description: Interactive conversion chart for fractions, inches, letter drills, and millimeters
author_profile: true
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
</div>

<div id="chart-container" style="overflow-x: auto;">
  <table id="conversion-chart">
    <thead id="chart-header"></thead>
    <tbody id="chart-body"></tbody>
  </table>
</div>

<script src="{{ '/assets/js/drill-sizes.js' | relative_url }}"></script>
<script src="{{ '/assets/js/fraction-inch-mm-chart.js' | relative_url }}"></script>

