---
layout: page
title: thread size chart
permalink: /thread-size-chart/
description: Interactive thread size chart for American (Unified) and Metric threads
nav: false
---

<div style="margin-bottom: 1rem; padding: 1rem; background-color: var(--global-card-bg-color); border-left: 4px solid var(--global-theme-color); font-size: 0.9rem; color: var(--global-text-color);">
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
  <table id="thread-chart" class="table table-striped" style="min-width: 100%;">
    <thead id="chart-header"></thead>
    <tbody id="chart-body"></tbody>
  </table>
</div>

<style>
  #thread-chart {
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  #thread-chart th,
  #thread-chart td {
    padding: 0.5rem;
    text-align: center;
    border: 1px solid var(--global-divider-color);
  }

  #thread-chart th {
    background-color: var(--global-card-bg-color);
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  #thread-chart tbody tr:nth-child(even) {
    background-color: var(--global-card-bg-color);
  }

  #thread-chart tbody tr:hover {
    background-color: var(--global-divider-color);
    opacity: 0.5;
  }
  
  html[data-theme="dark"] #thread-chart tbody tr:hover {
    background-color: var(--global-divider-color);
    opacity: 0.3;
  }
</style>

<script>
  (function () {
    // Letter drill sizes (A-Z) in inches
    const letterDrillSizes = {
      'A': 0.234, 'B': 0.238, 'C': 0.242, 'D': 0.246, 'E': 0.250,
      'F': 0.257, 'G': 0.261, 'H': 0.266, 'I': 0.272, 'J': 0.277,
      'K': 0.281, 'L': 0.290, 'M': 0.295, 'N': 0.302, 'O': 0.316,
      'P': 0.323, 'Q': 0.332, 'R': 0.339, 'S': 0.348, 'T': 0.358,
      'U': 0.368, 'V': 0.377, 'W': 0.386, 'X': 0.397, 'Y': 0.404, 'Z': 0.413
    };
    
    // Number drill sizes (#0-#80) in inches
    const numberDrillSizes = {
      '#0': 0.0600, '#1': 0.2280, '#2': 0.2210, '#3': 0.2130, '#4': 0.2090,
      '#5': 0.2055, '#6': 0.2040, '#7': 0.2010, '#8': 0.1990, '#9': 0.1960,
      '#10': 0.1935, '#11': 0.1910, '#12': 0.1890, '#13': 0.1850, '#14': 0.1820,
      '#15': 0.1800, '#16': 0.1770, '#17': 0.1730, '#18': 0.1695, '#19': 0.1660,
      '#20': 0.1610, '#21': 0.1590, '#22': 0.1570, '#23': 0.1540, '#24': 0.1520,
      '#25': 0.1495, '#26': 0.1470, '#27': 0.1440, '#28': 0.1405, '#29': 0.1360,
      '#30': 0.1285, '#31': 0.1200, '#32': 0.1160, '#33': 0.1130, '#34': 0.1110,
      '#35': 0.1100, '#36': 0.1065, '#37': 0.1040, '#38': 0.1015, '#39': 0.0995,
      '#40': 0.0980, '#41': 0.0960, '#42': 0.0935, '#43': 0.0890, '#44': 0.0860,
      '#45': 0.0820, '#46': 0.0810, '#47': 0.0785, '#48': 0.0760, '#49': 0.0730,
      '#50': 0.0700, '#51': 0.0670, '#52': 0.0635, '#53': 0.0595, '#54': 0.0550,
      '#55': 0.0520, '#56': 0.0465, '#57': 0.0430, '#58': 0.0420, '#59': 0.0410,
      '#60': 0.0400, '#61': 0.0390, '#62': 0.0380, '#63': 0.0370, '#64': 0.0360,
      '#65': 0.0350, '#66': 0.0330, '#67': 0.0320, '#68': 0.0310, '#69': 0.0292,
      '#70': 0.0280, '#71': 0.0260, '#72': 0.0250, '#73': 0.0240, '#74': 0.0225,
      '#75': 0.0210, '#76': 0.0200, '#77': 0.0180, '#78': 0.0160, '#79': 0.0145, '#80': 0.0135
    };
    
    // Find exact letter and/or number drill matches
    // Returns only the closest match(es) if multiple are within tolerance
    function findExactDrills(decimal) {
      // Calculate tolerance based on slider value (0 = exact, 1-5 = increasing)
      let tolerance;
      if (drillTolerance === 0) {
        tolerance = 0.000001; // Exact match only
      } else {
        // Map slider values 1-5 to tolerance values
        const toleranceMap = [0.00001, 0.00005, 0.0001, 0.0005, 0.001];
        tolerance = toleranceMap[drillTolerance - 1] || 0.0001;
      }
      
      let bestMatches = [];
      let bestDiff = Infinity;
      
      // Check all drills and find the closest match(es)
      for (const [letter, size] of Object.entries(letterDrillSizes)) {
        const diff = Math.abs(size - decimal);
        if (diff < tolerance) {
          if (diff < bestDiff) {
            bestDiff = diff;
            bestMatches = [letter];
          } else if (Math.abs(diff - bestDiff) < 0.000001) {
            // Same difference - add to matches
            bestMatches.push(letter);
          }
        }
      }
      
      for (const [number, size] of Object.entries(numberDrillSizes)) {
        const diff = Math.abs(size - decimal);
        if (diff < tolerance) {
          if (diff < bestDiff) {
            bestDiff = diff;
            bestMatches = [number];
          } else if (Math.abs(diff - bestDiff) < 0.000001) {
            // Same difference - add to matches
            bestMatches.push(number);
          }
        }
      }
      
      return bestMatches.length > 0 ? bestMatches : null;
    }
    
    // Convert decimal to fraction (simple common fractions, including values > 1)
    // Returns only the closest match if multiple are within tolerance
    function decimalToFraction(decimal) {
      const commonFractions = [
        [0, '0'], [1/64, '1/64'], [1/32, '1/32'], [3/64, '3/64'], [1/16, '1/16'],
        [5/64, '5/64'], [3/32, '3/32'], [7/64, '7/64'], [1/8, '1/8'], [9/64, '9/64'],
        [5/32, '5/32'], [11/64, '11/64'], [3/16, '3/16'], [13/64, '13/64'], [7/32, '7/32'],
        [15/64, '15/64'], [1/4, '1/4'], [17/64, '17/64'], [9/32, '9/32'], [19/64, '19/64'],
        [5/16, '5/16'], [21/64, '21/64'], [11/32, '11/32'], [23/64, '23/64'], [3/8, '3/8'],
        [25/64, '25/64'], [13/32, '13/32'], [27/64, '27/64'], [7/16, '7/16'], [29/64, '29/64'],
        [15/32, '15/32'], [31/64, '31/64'], [1/2, '1/2'], [33/64, '33/64'], [17/32, '17/32'],
        [35/64, '35/64'], [9/16, '9/16'], [37/64, '37/64'], [19/32, '19/32'], [39/64, '39/64'],
        [5/8, '5/8'], [41/64, '41/64'], [21/32, '21/32'], [43/64, '43/64'], [11/16, '11/16'],
        [45/64, '45/64'], [23/32, '23/32'], [47/64, '47/64'], [3/4, '3/4'], [49/64, '49/64'],
        [25/32, '25/32'], [51/64, '51/64'], [13/16, '13/16'], [53/64, '53/64'], [27/32, '27/32'],
        [55/64, '55/64'], [7/8, '7/8'], [57/64, '57/64'], [29/32, '29/32'], [59/64, '59/64'],
        [15/16, '15/16'], [61/64, '61/64'], [31/32, '31/32'], [63/64, '63/64'], [1, '1'],
        // Fractions greater than 1 (for tap drills > 1 inch)
        [1 + 1/64, '1 1/64'], [1 + 1/32, '1 1/32'], [1 + 3/64, '1 3/64'], [1 + 1/16, '1 1/16'],
        [1 + 5/64, '1 5/64'], [1 + 3/32, '1 3/32'], [1 + 7/64, '1 7/64'], [1 + 1/8, '1 1/8'],
        [1 + 9/64, '1 9/64'], [1 + 5/32, '1 5/32'], [1 + 11/64, '1 11/64'], [1 + 3/16, '1 3/16'],
        [1 + 13/64, '1 13/64'], [1 + 7/32, '1 7/32'], [1 + 15/64, '1 15/64'], [1 + 1/4, '1 1/4'],
        [1 + 17/64, '1 17/64'], [1 + 9/32, '1 9/32'], [1 + 19/64, '1 19/64'], [1 + 5/16, '1 5/16'],
        [1 + 21/64, '1 21/64'], [1 + 11/32, '1 11/32'], [1 + 23/64, '1 23/64'], [1 + 3/8, '1 3/8'],
        [1 + 25/64, '1 25/64'], [1 + 13/32, '1 13/32'], [1 + 27/64, '1 27/64'], [1 + 7/16, '1 7/16'],
        [1 + 29/64, '1 29/64'], [1 + 15/32, '1 15/32'], [1 + 31/64, '1 31/64'], [1 + 1/2, '1 1/2'],
        [1 + 33/64, '1 33/64'], [1 + 17/32, '1 17/32'], [1 + 35/64, '1 35/64'], [1 + 9/16, '1 9/16'],
        [1 + 37/64, '1 37/64'], [1 + 19/32, '1 19/32'], [1 + 39/64, '1 39/64'], [1 + 5/8, '1 5/8'],
        [1 + 41/64, '1 41/64'], [1 + 21/32, '1 21/32'], [1 + 43/64, '1 43/64'], [1 + 11/16, '1 11/16'],
        [1 + 45/64, '1 45/64'], [1 + 23/32, '1 23/32'], [1 + 47/64, '1 47/64'], [1 + 3/4, '1 3/4'],
        [1 + 49/64, '1 49/64'], [1 + 25/32, '1 25/32'], [1 + 51/64, '1 51/64'], [1 + 13/16, '1 13/16'],
        [1 + 53/64, '1 53/64'], [1 + 27/32, '1 27/32'], [1 + 55/64, '1 55/64'], [1 + 7/8, '1 7/8'],
        [1 + 57/64, '1 57/64'], [1 + 29/32, '1 29/32'], [1 + 59/64, '1 59/64'], [1 + 15/16, '1 15/16'],
        [1 + 61/64, '1 61/64'], [1 + 31/32, '1 31/32'], [1 + 63/64, '1 63/64'], [2, '2']
      ];
      
      // Calculate tolerance based on slider value (0 = exact, 1-5 = increasing)
      let tolerance;
      if (drillTolerance === 0) {
        tolerance = 0.000001; // Exact match only
      } else {
        // Map slider values 1-5 to tolerance values
        const toleranceMap = [0.00001, 0.00005, 0.0001, 0.0005, 0.001];
        tolerance = toleranceMap[drillTolerance - 1] || 0.0001;
      }
      
      let bestMatch = null;
      let bestDiff = Infinity;
      
      for (const [dec, frac] of commonFractions) {
        const diff = Math.abs(dec - decimal);
        if (diff < tolerance && diff < bestDiff) {
          bestDiff = diff;
          bestMatch = frac;
        }
      }
      
      return bestMatch;
    }
    
    // American (Unified) thread data
    // Format: [Thread Size, Major Diameter (in), TPI, UN Designation, Tap Drill (in), Clearance Drill (in)]
    const americanThreads = [
      ['#0', 0.0600, 80, 'UNC', 0.047, 0.0625],
      ['#1', 0.0730, 64, 'UNC', 0.0595, 0.0781],
      ['#2', 0.0860, 56, 'UNC', 0.0700, 0.0938],
      ['#3', 0.0990, 48, 'UNC', 0.0810, 0.1094],
      ['#4', 0.1120, 40, 'UNC', 0.0935, 0.1250],
      ['#5', 0.1250, 40, 'UNC', 0.1065, 0.1406],
      ['#6', 0.1380, 32, 'UNC', 0.1200, 0.1562],
      ['#8', 0.1640, 32, 'UNC', 0.1440, 0.1719],
      ['#10', 0.1900, 24, 'UNC', 0.1695, 0.2031],
      ['#12', 0.2160, 24, 'UNC', 0.1940, 0.2344],
      ['1/4', 0.2500, 20, 'UNC', 0.2010, 0.2656],
      ['1/4', 0.2500, 28, 'UNF', 0.2130, 0.2656],
      ['5/16', 0.3125, 18, 'UNC', 0.2570, 0.3281],
      ['5/16', 0.3125, 24, 'UNF', 0.2720, 0.3281],
      ['3/8', 0.3750, 16, 'UNC', 0.3125, 0.3906],
      ['3/8', 0.3750, 24, 'UNF', 0.3320, 0.3906],
      ['7/16', 0.4375, 14, 'UNC', 0.3680, 0.4531],
      ['7/16', 0.4375, 20, 'UNF', 0.3970, 0.4531],
      ['1/2', 0.5000, 13, 'UNC', 0.4219, 0.5156],
      ['1/2', 0.5000, 20, 'UNF', 0.4531, 0.5156],
      ['9/16', 0.5625, 12, 'UNC', 0.4844, 0.5781],
      ['9/16', 0.5625, 18, 'UNF', 0.5078, 0.5781],
      ['5/8', 0.6250, 11, 'UNC', 0.5469, 0.6406],
      ['5/8', 0.6250, 18, 'UNF', 0.5703, 0.6406],
      ['3/4', 0.7500, 10, 'UNC', 0.6562, 0.7656],
      ['3/4', 0.7500, 16, 'UNF', 0.6875, 0.7656],
      ['7/8', 0.8750, 9, 'UNC', 0.7656, 0.8906],
      ['7/8', 0.8750, 14, 'UNF', 0.8125, 0.8906],
      ['1', 1.0000, 8, 'UNC', 0.8750, 1.0156],
      ['1', 1.0000, 12, 'UNF', 0.9375, 1.0156],
      ['1 1/8', 1.1250, 7, 'UNC', 0.9844, 1.1406],
      ['1 1/8', 1.1250, 12, 'UNF', 1.0625, 1.1406],
      ['1 1/4', 1.2500, 7, 'UNC', 1.1094, 1.2656],
      ['1 1/4', 1.2500, 12, 'UNF', 1.1875, 1.2656],
      ['1 3/8', 1.3750, 6, 'UNC', 1.2031, 1.3906],
      ['1 3/8', 1.3750, 12, 'UNF', 1.3125, 1.3906],
      ['1 1/2', 1.5000, 6, 'UNC', 1.3281, 1.5156],
      ['1 1/2', 1.5000, 12, 'UNF', 1.4375, 1.5156],
      ['1 3/4', 1.7500, 5, 'UNC', 1.5469, 1.7656],
      ['2', 2.0000, 4.5, 'UNC', 1.7656, 2.0156],
    ];

    // Metric thread data
    // Format: [Thread Size (M), Major Diameter (mm), Pitch (mm), Tap Drill (mm), Clearance Drill (mm), Thread Type ('coarse' or 'fine')]
    // Data based on ISO metric thread standards from sizes.com
    const metricThreads = [
      // Coarse threads
      ['M1', 1.0, 0.25, 0.75, 1.1, 'coarse'],
      ['M1.2', 1.2, 0.25, 0.95, 1.3, 'coarse'],
      ['M1.4', 1.4, 0.3, 1.1, 1.5, 'coarse'],
      ['M1.6', 1.6, 0.35, 1.25, 1.7, 'coarse'],
      ['M1.8', 1.8, 0.35, 1.45, 1.9, 'coarse'],
      ['M2', 2.0, 0.4, 1.6, 2.2, 'coarse'],
      ['M2.2', 2.2, 0.45, 1.75, 2.4, 'coarse'],
      ['M2.5', 2.5, 0.45, 2.05, 2.7, 'coarse'],
      ['M3', 3.0, 0.5, 2.5, 3.2, 'coarse'],
      ['M3.5', 3.5, 0.6, 2.9, 3.7, 'coarse'],
      ['M4', 4.0, 0.7, 3.3, 4.3, 'coarse'],
      ['M4.5', 4.5, 0.75, 3.7, 4.8, 'coarse'],
      ['M5', 5.0, 0.8, 4.2, 5.3, 'coarse'],
      ['M6', 6.0, 1.0, 5.0, 6.4, 'coarse'],
      ['M7', 7.0, 1.0, 6.0, 7.4, 'coarse'],
      ['M8', 8.0, 1.25, 6.8, 8.4, 'coarse'],
      ['M10', 10.0, 1.5, 8.5, 10.5, 'coarse'],
      ['M12', 12.0, 1.75, 10.2, 12.5, 'coarse'],
      ['M14', 14.0, 2.0, 12.0, 14.5, 'coarse'],
      ['M16', 16.0, 2.0, 14.0, 16.5, 'coarse'],
      ['M18', 18.0, 2.5, 15.5, 18.5, 'coarse'],
      ['M20', 20.0, 2.5, 17.5, 20.5, 'coarse'],
      ['M22', 22.0, 2.5, 19.5, 22.5, 'coarse'],
      ['M24', 24.0, 3.0, 21.0, 24.5, 'coarse'],
      ['M27', 27.0, 3.0, 24.0, 27.5, 'coarse'],
      ['M30', 30.0, 3.5, 26.5, 30.5, 'coarse'],
      ['M33', 33.0, 3.5, 29.5, 33.5, 'coarse'],
      ['M36', 36.0, 4.0, 32.0, 36.5, 'coarse'],
      ['M39', 39.0, 4.0, 35.0, 39.5, 'coarse'],
      ['M42', 42.0, 4.5, 37.5, 42.5, 'coarse'],
      ['M45', 45.0, 4.5, 40.5, 45.5, 'coarse'],
      ['M48', 48.0, 5.0, 43.0, 48.5, 'coarse'],
      ['M52', 52.0, 5.0, 47.0, 52.5, 'coarse'],
      ['M56', 56.0, 5.5, 50.5, 56.5, 'coarse'],
      ['M60', 60.0, 5.5, 54.5, 60.5, 'coarse'],
      ['M64', 64.0, 6.0, 58.0, 64.5, 'coarse'],
      // Fine threads
      ['M3', 3.0, 0.35, 2.65, 3.3, 'fine'],
      ['M4', 4.0, 0.5, 3.5, 4.3, 'fine'],
      ['M5', 5.0, 0.5, 4.5, 5.3, 'fine'],
      ['M6', 6.0, 0.75, 5.25, 6.4, 'fine'],
      ['M8', 8.0, 1.0, 7.0, 8.4, 'fine'],
      ['M10', 10.0, 1.25, 8.75, 10.5, 'fine'],
      ['M12', 12.0, 1.25, 10.75, 12.5, 'fine'],
      ['M14', 14.0, 1.5, 12.5, 14.5, 'fine'],
      ['M16', 16.0, 1.5, 14.5, 16.5, 'fine'],
      ['M18', 18.0, 1.5, 16.5, 18.5, 'fine'],
      ['M20', 20.0, 1.5, 18.5, 20.5, 'fine'],
      ['M22', 22.0, 1.5, 20.5, 22.5, 'fine'],
      ['M24', 24.0, 2.0, 22.0, 24.5, 'fine'],
      ['M27', 27.0, 2.0, 25.0, 27.5, 'fine'],
      ['M30', 30.0, 2.0, 28.0, 30.5, 'fine'],
      ['M33', 33.0, 2.0, 31.0, 33.5, 'fine'],
      ['M36', 36.0, 3.0, 33.0, 36.5, 'fine'],
      ['M39', 39.0, 3.0, 36.0, 39.5, 'fine'],
      ['M42', 42.0, 3.0, 39.0, 42.5, 'fine'],
      ['M45', 45.0, 3.0, 42.0, 45.5, 'fine'],
      ['M48', 48.0, 3.0, 45.0, 48.5, 'fine'],
      ['M52', 52.0, 3.0, 49.0, 52.5, 'fine'],
      ['M56', 56.0, 4.0, 52.0, 56.5, 'fine'],
      ['M60', 60.0, 4.0, 56.0, 60.5, 'fine'],
      ['M64', 64.0, 4.0, 60.0, 64.5, 'fine'],
    ];

    // State
    const allColumns = ['thread-size', 'major-dia', 'clearance-drill', 'pitch', 'tpi', 'tap-drill'];
    let threadType = 'american'; // 'american' or 'metric'
    let enabledUnDesignations = ['UNC', 'UNF']; // Which UN designations to show
    let showMillimeters = false; // Whether to show millimeters for American threads
    let enabledMetricTypes = ['coarse', 'fine']; // Which metric thread types to show
    let showInches = false; // Whether to show inches for metric threads
    let showTPI = true; // Whether to show TPI column (default true for American, false for Metric)
    let drillTolerance = 0; // Drill size matching tolerance (0 = exact only, 1-5 = increasing tolerance)

    // Get all thread data
    function getThreadData() {
      const data = [];

      if (threadType === 'american') {
        americanThreads.forEach((thread) => {
          const [size, majorDia, tpi, unDesignation, tapDrill, clearanceDrill] = thread;
          // Filter by enabled UN designations
          if (!enabledUnDesignations.includes(unDesignation)) {
            return;
          }
          const pitch = 1 / tpi; // Pitch in inches
          data.push({
            type: 'American',
            threadSize: size,
            threadSizeDisplay: `${size}-${tpi} ${unDesignation}`,
            majorDiaIn: majorDia,
            majorDiaMm: majorDia * 25.4,
            pitchIn: pitch,
            pitchMm: pitch * 25.4,
            tpi: tpi,
            unDesignation: unDesignation,
            tapDrillIn: tapDrill,
            tapDrillMm: tapDrill * 25.4,
            clearanceDrillIn: clearanceDrill,
            clearanceDrillMm: clearanceDrill * 25.4,
          });
        });
      } else if (threadType === 'metric') {
        metricThreads.forEach((thread) => {
          const [size, majorDia, pitch, tapDrill, clearanceDrill, metricType] = thread;
          // Filter by enabled metric thread types (coarse/fine)
          if (!enabledMetricTypes.includes(metricType)) {
            return;
          }
          // Calculate TPI for metric threads: TPI = 25.4 / pitch (mm)
          const tpi = 25.4 / pitch;
          // Format thread type for display (capitalize first letter)
          const threadTypeLabel = metricType.charAt(0).toUpperCase() + metricType.slice(1);
          data.push({
            type: 'Metric',
            threadSize: size,
            threadSizeDisplay: `${size}x${pitch} (${threadTypeLabel})`,
            majorDiaIn: majorDia / 25.4,
            majorDiaMm: majorDia,
            pitchIn: pitch / 25.4,
            pitchMm: pitch,
            tpi: tpi,
            tapDrillIn: tapDrill / 25.4,
            tapDrillMm: tapDrill,
            clearanceDrillIn: clearanceDrill / 25.4,
            clearanceDrillMm: clearanceDrill,
            metricType: metricType,
          });
        });
      }

      // Sort by major diameter
      data.sort((a, b) => a.majorDiaMm - b.majorDiaMm);

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
      allColumns.forEach((col) => {
        // Skip TPI column if showTPI is false
        if (col === 'tpi' && !showTPI) {
          return;
        }
        const th = document.createElement('th');
        let headerText = col.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        // Special handling for column headers
        if (col === 'tpi') {
          headerText = 'TPI';
        } else if (col === 'major-dia') {
          headerText = 'Major Diameter';
        } else if (col === 'clearance-drill') {
          headerText = 'Clearance Diameter';
        }
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      header.appendChild(headerRow);

      // Get thread data
      const data = getThreadData();

      // Create body rows
      data.forEach((item) => {
        const row = document.createElement('tr');

        allColumns.forEach((col) => {
          // Skip TPI column if showTPI is false
          if (col === 'tpi' && !showTPI) {
            return;
          }
          const td = document.createElement('td');
          let value = '';

          switch (col) {
            case 'thread-size':
              if (item.type === 'American') {
                value = item.threadSizeDisplay || item.threadSize;
              } else {
                value = item.threadSizeDisplay || item.threadSize;
              }
              break;
            case 'major-dia':
              if (item.type === 'American') {
                if (showMillimeters) {
                  td.innerHTML = `${item.majorDiaIn.toFixed(4)} in<br>${item.majorDiaMm.toFixed(2)} mm`;
                  value = `${item.majorDiaIn.toFixed(4)} in\n${item.majorDiaMm.toFixed(2)} mm`;
                } else {
                  td.innerHTML = `${item.majorDiaIn.toFixed(4)} in`;
                  value = `${item.majorDiaIn.toFixed(4)} in`;
                }
              } else {
                if (showInches) {
                  td.innerHTML = `${item.majorDiaMm.toFixed(2)} mm<br>${item.majorDiaIn.toFixed(4)} in`;
                  value = `${item.majorDiaMm.toFixed(2)} mm\n${item.majorDiaIn.toFixed(4)} in`;
                } else {
                  td.innerHTML = `${item.majorDiaMm.toFixed(2)} mm`;
                  value = `${item.majorDiaMm.toFixed(2)} mm`;
                }
              }
              break;
            case 'pitch':
              if (item.type === 'American') {
                if (showMillimeters) {
                  td.innerHTML = `${item.pitchIn.toFixed(4)} in<br>${item.pitchMm.toFixed(2)} mm`;
                  value = `${item.pitchIn.toFixed(4)} in\n${item.pitchMm.toFixed(2)} mm`;
                } else {
                  td.innerHTML = `${item.pitchIn.toFixed(4)} in`;
                  value = `${item.pitchIn.toFixed(4)} in`;
                }
              } else {
                if (showInches) {
                  td.innerHTML = `${item.pitchMm.toFixed(2)} mm<br>${item.pitchIn.toFixed(4)} in`;
                  value = `${item.pitchMm.toFixed(2)} mm\n${item.pitchIn.toFixed(4)} in`;
                } else {
                  td.innerHTML = `${item.pitchMm.toFixed(2)} mm`;
                  value = `${item.pitchMm.toFixed(2)} mm`;
                }
              }
              break;
            case 'tpi':
              if (item.tpi) {
                // Format TPI with appropriate decimal places
                // For American threads, TPI is usually a whole number or simple fraction
                // For metric threads, TPI is calculated and may have more decimals
                if (item.type === 'American') {
                  value = item.tpi.toString();
                } else {
                  // Round to 2 decimal places for metric TPI
                  value = item.tpi.toFixed(2);
                }
              } else {
                value = '—';
              }
              break;
            case 'tap-drill':
              if (item.type === 'American') {
                const tapDrillIn = item.tapDrillIn;
                const drills = findExactDrills(tapDrillIn);
                // Only check for fraction if no exact drill match (within 0.000001)
                let fraction = null;
                let hasExactDrillMatch = false;
                if (drills) {
                  hasExactDrillMatch = drills.some(d => {
                    const drillSize = letterDrillSizes[d] || numberDrillSizes[d];
                    return Math.abs(drillSize - tapDrillIn) < 0.000001;
                  });
                }
                if (!hasExactDrillMatch) {
                  fraction = decimalToFraction(tapDrillIn);
                }
                
                let topLine = [];
                if (drills) {
                  // Add drills with decimal and "in" in parentheses
                  drills.forEach(drill => {
                    topLine.push(`${drill} (${tapDrillIn.toFixed(4)} in)`);
                  });
                }
                if (fraction) {
                  // Add fraction with decimal and "in" in parentheses
                  topLine.push(`${fraction} (${tapDrillIn.toFixed(4)} in)`);
                }
                
                let htmlParts = [];
                if (topLine.length > 0) {
                  htmlParts.push(topLine.join(' / '));
                } else {
                  // No drill or fraction match, show plain decimal with "in" (no parentheses)
                  htmlParts.push(`${tapDrillIn.toFixed(4)} in`);
                }
                
                if (showMillimeters) {
                  htmlParts.push(`${item.tapDrillMm.toFixed(2)} mm`);
                }
                
                td.innerHTML = htmlParts.join('<br>');
                value = htmlParts.join('\n');
              } else {
                if (showInches) {
                  td.innerHTML = `${item.tapDrillMm.toFixed(2)} mm<br>${item.tapDrillIn.toFixed(4)} in`;
                  value = `${item.tapDrillMm.toFixed(2)} mm\n${item.tapDrillIn.toFixed(4)} in`;
                } else {
                  td.innerHTML = `${item.tapDrillMm.toFixed(2)} mm`;
                  value = `${item.tapDrillMm.toFixed(2)} mm`;
                }
              }
              break;
            case 'clearance-drill':
              if (item.type === 'American') {
                const clearanceIn = item.clearanceDrillIn;
                const drills = findExactDrills(clearanceIn);
                // Only check for fraction if no exact drill match (within 0.000001)
                let fraction = null;
                let hasExactDrillMatch = false;
                if (drills) {
                  hasExactDrillMatch = drills.some(d => {
                    const drillSize = letterDrillSizes[d] || numberDrillSizes[d];
                    return Math.abs(drillSize - clearanceIn) < 0.000001;
                  });
                }
                if (!hasExactDrillMatch) {
                  fraction = decimalToFraction(clearanceIn);
                }
                
                let topLine = [];
                if (drills) {
                  // Add drills with decimal and "in" in parentheses
                  drills.forEach(drill => {
                    topLine.push(`${drill} (${clearanceIn.toFixed(4)} in)`);
                  });
                }
                if (fraction) {
                  // Add fraction with decimal and "in" in parentheses
                  topLine.push(`${fraction} (${clearanceIn.toFixed(4)} in)`);
                }
                
                let htmlParts = [];
                if (topLine.length > 0) {
                  htmlParts.push(topLine.join(' / '));
                } else {
                  // No drill or fraction match, show plain decimal with "in" (no parentheses)
                  htmlParts.push(`${clearanceIn.toFixed(4)} in`);
                }
                
                if (showMillimeters) {
                  htmlParts.push(`${item.clearanceDrillMm.toFixed(2)} mm`);
                }
                
                td.innerHTML = htmlParts.join('<br>');
                value = htmlParts.join('\n');
              } else {
                if (showInches) {
                  td.innerHTML = `${item.clearanceDrillMm.toFixed(2)} mm<br>${item.clearanceDrillIn.toFixed(4)} in`;
                  value = `${item.clearanceDrillMm.toFixed(2)} mm\n${item.clearanceDrillIn.toFixed(4)} in`;
                } else {
                  td.innerHTML = `${item.clearanceDrillMm.toFixed(2)} mm`;
                  value = `${item.clearanceDrillMm.toFixed(2)} mm`;
                }
              }
              break;
          }

          // Only set textContent if innerHTML wasn't already set
          if (!td.innerHTML) {
            td.textContent = value;
          }
          row.appendChild(td);
        });

        body.appendChild(row);
      });
    }


    // Event listener for thread type dropdown
    document.getElementById('thread-type-select').addEventListener('change', (e) => {
      threadType = e.target.value;
      // Show/hide filters based on thread type
      const americanFilters = document.getElementById('american-thread-filters');
      const metricFilters = document.getElementById('metric-thread-filters');
      const americanTPICheckbox = document.getElementById('cb-show-tpi-american');
      const metricTPICheckbox = document.getElementById('cb-show-tpi-metric');
      if (threadType === 'american') {
        americanFilters.style.display = 'block';
        metricFilters.style.display = 'none';
        // Default TPI on for American
        showTPI = americanTPICheckbox.checked;
      } else {
        americanFilters.style.display = 'none';
        metricFilters.style.display = 'block';
        // Default TPI off for Metric
        showTPI = metricTPICheckbox.checked;
      }
      renderChart();
    });

    // Event listeners for UNC/UNF checkboxes
    document.getElementById('cb-unc').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!enabledUnDesignations.includes('UNC')) {
          enabledUnDesignations.push('UNC');
        }
      } else {
        enabledUnDesignations = enabledUnDesignations.filter(d => d !== 'UNC');
      }
      renderChart();
    });

    document.getElementById('cb-unf').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!enabledUnDesignations.includes('UNF')) {
          enabledUnDesignations.push('UNF');
        }
      } else {
        enabledUnDesignations = enabledUnDesignations.filter(d => d !== 'UNF');
      }
      renderChart();
    });

    // Event listener for show millimeters checkbox
    document.getElementById('cb-show-mm').addEventListener('change', (e) => {
      showMillimeters = e.target.checked;
      renderChart();
    });

    // Event listeners for metric thread type checkboxes
    document.getElementById('cb-coarse').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!enabledMetricTypes.includes('coarse')) {
          enabledMetricTypes.push('coarse');
        }
      } else {
        enabledMetricTypes = enabledMetricTypes.filter(t => t !== 'coarse');
      }
      renderChart();
    });

    document.getElementById('cb-fine').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!enabledMetricTypes.includes('fine')) {
          enabledMetricTypes.push('fine');
        }
      } else {
        enabledMetricTypes = enabledMetricTypes.filter(t => t !== 'fine');
      }
      renderChart();
    });

    // Event listener for show inches checkbox
    document.getElementById('cb-show-inches').addEventListener('change', (e) => {
      showInches = e.target.checked;
      renderChart();
    });

    // Event listener for TPI checkbox (American)
    document.getElementById('cb-show-tpi-american').addEventListener('change', (e) => {
      if (threadType === 'american') {
        showTPI = e.target.checked;
        renderChart();
      }
    });

    // Event listener for TPI checkbox (Metric)
    document.getElementById('cb-show-tpi-metric').addEventListener('change', (e) => {
      if (threadType === 'metric') {
        showTPI = e.target.checked;
        renderChart();
      }
    });

    // Event listener for drill tolerance slider
    const toleranceSlider = document.getElementById('drill-tolerance-slider');
    const toleranceValue = document.getElementById('drill-tolerance-value');
    const toleranceLabels = ['0 (Exact)', '1 (0.00001)', '2 (0.00005)', '3 (0.0001)', '4 (0.0005)', '5 (0.001)'];
    
    toleranceSlider.addEventListener('input', (e) => {
      drillTolerance = parseInt(e.target.value);
      toleranceValue.textContent = toleranceLabels[drillTolerance] || `${drillTolerance}`;
      if (threadType === 'american') {
        renderChart();
      }
    });

    // Initialize - show appropriate filters based on thread type
    if (threadType === 'american') {
      document.getElementById('american-thread-filters').style.display = 'block';
      showTPI = document.getElementById('cb-show-tpi-american').checked;
    } else {
      document.getElementById('metric-thread-filters').style.display = 'block';
      showTPI = document.getElementById('cb-show-tpi-metric').checked;
    }
    renderChart();
  })();
</script>
