---
layout: single
title: "Thread Size Chart"
permalink: /thread-size-chart/
description: Interactive thread size chart for American (Unified) and Metric threads
author_profile: false
---

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

<div class="notice--info">
  <strong>Data Sources:</strong> Thread diameters, TPI/pitch, and tap drill sizes are cross-checked against
  <a href="https://www.sizes.com/tools/thread_american.htm" target="_blank" rel="noopener noreferrer">American Thread Standards</a> and
  <a href="https://www.sizes.com/tools/thread_metric.htm" target="_blank" rel="noopener noreferrer">Metric Thread Standards</a>
  on <a href="https://www.sizes.com" target="_blank" rel="noopener noreferrer">sizes.com</a>, which cover sizes up to 1" (American) and 30&nbsp;mm (metric); larger sizes use standard machinist references instead.
  No ASME/ISO standard we could access directly tabulates tap-drill selection for UN threads (ASME B1.1 defines thread geometry
  &mdash; including the basic minor diameter D1 in Tables 6/7 &mdash; but no drill-selection table, and ASME B94.9's tap drill table
  covers pipe taps only), so tap drills above 1" are computed from that same B1.1 geometry: each one sits at a constant offset above
  its size's basic minor diameter D1, and that offset is identical for every size sharing the same TPI &mdash; confirmed against the
  four 12-TPI UNF sizes from 1" to 1-1/2" (including the already-verified 1" row), which all sit exactly 0.0277" above D1, and
  similarly for the 7-TPI and 6-TPI UNC pairs (0.0140" and 0.0085").
  <br><br>
  Clearance drill sizes are read directly from primary standards: <strong>ASME B18.2.8-1999</strong> Table 2 (Close Fit / H12) for inch
  sizes #0&ndash;1-1/2", which is the full range that standard covers per its own Scope section &mdash; two sizes
  (#12 and 9/16") aren't individually tabulated there and are computed the same way the standard derives the rest of the table:
  nominal diameter plus the Close Fit allowance from Table 1's size bracket, rounded to the nearest standard drill.
  Inch sizes 1-3/4" and 2" fall outside B18.2.8's stated scope (it explicitly covers "#0 through 1.5 in"); their values extend the
  standard's own last allowance bracket (1-3/8", 1-1/2": Close Fit = major diameter + 1/16") rather than a tabulated figure.
  Metric clearance sizes are read from the "fine" series (H12) of <strong>ISO 273:1979</strong> Table (dimensions in mm), which ASME B18.2.8
  itself cites as the source its own metric table agrees with; this covers every metric size on this chart except M2.2, whose value
  (major diameter + 0.2&nbsp;mm) is the same allowance ISO 273 uses for both its immediate neighbors, M2 and M2.5 &mdash; interpolated
  from the standard rather than tabulated directly, since M2.2 itself is a non-preferred size neither ISO 273 nor B18.2.8 lists.
</div>

