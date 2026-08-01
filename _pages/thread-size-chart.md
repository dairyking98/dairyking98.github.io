---
layout: single
title: "Thread Size Chart"
permalink: /thread-size-chart/
description: Interactive thread size chart for American (Unified) and Metric threads
author_profile: true
---

<div class="notice--info">
  <strong>Data Source:</strong> Thread size data is based on information from
  <a href="https://www.sizes.com/tools/thread_american.htm" target="_blank" rel="noopener noreferrer">American Thread Standards</a> and
  <a href="https://www.sizes.com/tools/thread_metric.htm" target="_blank" rel="noopener noreferrer">Metric Thread Standards</a>
  from <a href="https://www.sizes.com" target="_blank" rel="noopener noreferrer">sizes.com</a>.
</div>

<div id="chart-controls" style="margin-bottom: 2rem;">
  <div id="thread-type-controls" style="margin-bottom: 1rem;">
    <h3>Thread Type</h3>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem;">
      <label for="thread-type-select">Select Thread Type:</label>
      <select id="thread-type-select" style="width: 200px; padding: 0.5rem;">
        <option value="american">American (Unified)</option>
        <option value="metric">Metric</option>
      </select>
    </div>
    <div id="american-thread-filters" style="display: none;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-unc" value="UNC" checked>
          <span>UNC</span>
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-unf" value="UNF" checked>
          <span>UNF</span>
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-show-mm" value="show-mm">
          <span>Show Millimeters</span>
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-show-tpi-american" value="show-tpi" checked>
          <span>Show TPI</span>
        </label>
      </div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-top: 1rem;">
        <label for="drill-tolerance-slider" style="display: flex; align-items: center; gap: 0.5rem;">
          <span>Drill Size Tolerance:</span>
          <input type="range" id="drill-tolerance-slider" min="0" max="5" step="1" value="0" style="width: 150px;">
          <span id="drill-tolerance-value">0 (Exact)</span>
        </label>
      </div>
    </div>
    <div id="metric-thread-filters" style="display: none;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-coarse" value="coarse" checked>
          <span>Coarse</span>
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-fine" value="fine" checked>
          <span>Fine</span>
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-show-inches" value="show-inches">
          <span>Show Inches</span>
        </label>
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="cb-show-tpi-metric" value="show-tpi">
          <span>Show TPI</span>
        </label>
      </div>
    </div>
  </div>
</div>

<div id="chart-container" style="overflow-x: auto;">
  <table id="thread-chart">
    <thead id="chart-header"></thead>
    <tbody id="chart-body"></tbody>
  </table>
</div>

<script src="{{ '/assets/js/drill-sizes.js' | relative_url }}"></script>
<script src="{{ '/assets/js/thread-size-chart.js' | relative_url }}"></script>

