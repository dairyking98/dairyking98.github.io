---
layout: single
title: "Clearance Hole Chart"
permalink: /clearance-hole-chart/
description: Inch and metric screw clearance holes in close, normal, and loose fits, with a GD&T positional tolerance calculator
author_profile: false
---

Clearance hole sizes for inch and metric bolts and screws in all three fit classes, plus a calculator that turns a
clearance hole into the positional tolerance it can carry (and back).

<div id="chart-controls" style="margin-bottom: 2rem;">
  <h3>Clearance Holes</h3>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem;">
    <label for="chart-system-select">Select System:</label>
    <select id="chart-system-select" style="padding: 0.5rem;">
      <option value="inch">Inch (ASME B18.2.8)</option>
      <option value="metric">Metric (ISO 273)</option>
    </select>
  </div>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
      <input type="checkbox" id="cb-fit-close" checked>
      <span>Close</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
      <input type="checkbox" id="cb-fit-normal" checked>
      <span>Normal</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
      <input type="checkbox" id="cb-fit-loose" checked>
      <span>Loose</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
      <input type="checkbox" id="cb-show-converted">
      <span id="cb-show-converted-label">Show Millimeters</span>
    </label>
    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
      <input type="checkbox" id="cb-show-position">
      <span>Show Position Tolerance</span>
    </label>
  </div>
</div>

<div id="chart-container" style="overflow-x: auto;">
  <table id="clearance-chart">
    <thead id="chart-header"></thead>
    <tbody id="chart-body"></tbody>
  </table>
</div>

<div id="clearance-calc">
  <h3>Positional Tolerance Calculator</h3>
  <p>
    Pick a screw and a fit to fill in F and H, or type your own values. Results use the formulas in ASME Y14.5
    Appendix B and assume both the hole and the fastener are at MMC.
  </p>

  <div class="clearance-calc__grid">
    <label for="calc-system-select">System</label>
    <select id="calc-system-select">
      <option value="inch">Inch</option>
      <option value="metric">Metric</option>
    </select>

    <label for="calc-size-select">Screw size</label>
    <select id="calc-size-select"></select>

    <label for="calc-fit-select">Fit</label>
    <select id="calc-fit-select">
      <option value="close">Close</option>
      <option value="normal" selected>Normal</option>
      <option value="loose">Loose</option>
      <option value="custom">Custom hole</option>
    </select>

    <label for="calc-fastener">F, fastener max &Oslash;</label>
    <span><input type="number" id="calc-fastener" step="any" min="0"> <span class="calc-unit">in</span></span>

    <label for="calc-hole">H, hole min &Oslash;</label>
    <span><input type="number" id="calc-hole" step="any" min="0"> <span class="calc-unit">in</span></span>

    <label for="calc-t1">T&#8321;, clearance part (optional)</label>
    <span><input type="number" id="calc-t1" step="any" min="0"> <span class="calc-unit">in</span></span>
  </div>

  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 1rem;">
    <input type="checkbox" id="cb-calc-tilt">
    <span>No projected tolerance zone on the tapped hole (allow for tilt)</span>
  </label>
  <div id="calc-tilt-inputs" class="clearance-calc__grid" style="display: none; margin-top: 0.5rem;">
    <label for="calc-p">P, max part thickness</label>
    <span><input type="number" id="calc-p" step="any" min="0"> <span class="calc-unit">in</span></span>

    <label for="calc-d">D, min thread engagement</label>
    <span><input type="number" id="calc-d" step="any" min="0"> <span class="calc-unit">in</span></span>
  </div>

  <h4>Position tolerance this hole allows</h4>
  <div id="calc-results"></div>

  <h4>Hole needed for a position tolerance</h4>
  <div class="clearance-calc__grid">
    <label for="calc-target">Target T, each part</label>
    <span><input type="number" id="calc-target" step="any" min="0"> <span class="calc-unit">in</span></span>
  </div>
  <div id="calc-reverse-results"></div>
</div>

<script src="{{ '/assets/js/clearance-hole-chart.js' | relative_url }}"></script>

<div class="notice--info" markdown="1">
**How to read it:** the drill is the nominal hole size, and the min&ndash;max range is the hole tolerance that the
standard applies: ISO 286 **H12** for close, **H13** for normal and **H14** for loose. Normal is the usual default.
Use close where parts locate off the screws or the pattern is tight, and loose for weldments and stacked tolerances.

**Floating vs. fixed fasteners:** a *floating* fastener passes through clearance holes in every part (bolt and
nut), so each part can use the full `T = H − F`. A *fixed* fastener is held in one part (screw in a tapped hole,
or a stud), so the same clearance is shared between both parts and each gets `T = (H − F) / 2`. You can also
split it unequally, `H = F + T₁ + T₂`. These formulas assume a projected tolerance zone on the tapped hole. Without
one, the tapped hole's axis can tilt, and Y14.5 uses `H = F + T₁ + T₂(1 + 2P/D)` instead, where P is the maximum
thickness of the part with the clearance hole and D is the minimum thread engagement.

**About F:** the calculator and the chart's position tolerance line default F to the screw's nominal diameter.
A real screw's maximum major diameter is a little smaller (1/4-20 UNC-2A is 0.2489 in, M6&times;1 6g is
5.974 mm), so nominal is slightly conservative. Enter the actual maximum major diameter for exact figures.
</div>

<div class="notice--info">
  <strong>Data Sources:</strong> Hole sizes are transcribed directly from <strong>ASME B18.2.8-1999</strong>,
  <em>Clearance Holes for Bolts, Screws, and Studs</em>: Table 2 for inch fasteners (#0 through 1-1/2 in, the
  standard's full stated scope) and Table 3 for metric fasteners (M1.6 through M100). The standard states that its
  metric holes agree with <strong>ISO 273</strong>, whose fine, medium and coarse series match the close, normal and
  loose fits here; ISO 273 also lists intermediate sizes (such as M3.5, M18 and M22) and sizes up to M150, which
  this chart leaves out rather than estimating them. Hole tolerances are per ISO 286 (H12/H13/H14), as B18.2.8
  Sec. 3.3 specifies.
  <br><br>
  Positional tolerance formulas are from <strong>ASME Y14.5-2009</strong>, Nonmandatory Appendix B: floating
  fastener (B.3), fixed fastener with a projected tolerance zone (B.4), and the tilt allowance when no projected
  tolerance zone is used (B.5).
</div>
