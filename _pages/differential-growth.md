---
layout: page
title: differential growth
permalink: /differential-growth/
description: Interactive 2D differential growth visualization. Original concept and implementation by Jason Webb.
nav: false
differential_growth: true
---

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
<link rel="stylesheet" href="{{ '/assets/css/differential-growth.css' | relative_url }}">

<div id="differential-growth-container">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-backdrop"></div>

    <div class="modal-content">
      <button class="close first-focusable-element">
        <span class="fas fa-times"></span>
        <span class="sr-only">Close</span>
      </button>

      <div class="keyboard-controls-content is-hidden">
        <h1 id="keyboard-controls-heading">Keyboard shortcuts</h1>

        <ul>
          <li>
            <code>t</code> - toggle trace effect
          </li>
          <li>
            <code>n</code> - toggle visibility of nodes
          </li>
          <li>
            <code>r</code> - reset canvas
          </li>
          <li>
            <code>Space</code> - pause or unpause the simulation
          </li>
          <li>
            <code>d</code> - toggle debug mode
          </li>
          <li>
            <code>f</code> - toggle shape fills
          </li>
          <li>
            <code>h</code> - toggle history effect
          </li>
          <li>
            <code>s</code> - download an SVG of the current drawing
          </li>
        </ul>
      </div>

      <div class="about-content is-hidden">
        <h1>About this app</h1>
        <p>This interactive application lets you grow fun 2D forms out of simple shapes using a process found in nature called <em>differential growth</em>. Use the tools on the left to draw lines, rectangles, and circles or import custom SVG artwork, then hit the Play button to start the process!</p>
        <p>When you see something you like, use the Download SVG button (or the S key) to get a vector file that you can use with pen plotters, laser cutters, and design software like Fusion 360 or Illustrator!</p>

        <div class="columns">
          <div class="column">
            <h2>What is differential growth?</h2>
            <p><i>Differential growth</i> is a natural process that produces interesting undulating forms out of over-constrained chains of particles using simple, configurable rules.</p>
            <p>Anders Hoff describes this process well in his article <a href="https://inconvergent.net/2016/shepherding-random-growth/" target="_blank">Shepherding Random Growth</a>.</p>
          </div>

          <div class="column">
            <h2>How was this made?</h2>
            <p>This app was built using JavaScript (ES6), p5.js, Babel, Browserify, and a smattering of single-purpose packages.</p>
            <p>Source code and documentation <a href="https://github.com/jasonwebb/2d-differential-growth-experiments">available on Github</a>.</p>
          </div>
        </div>

        <div class="is-centered">
          <button class="start last-focusable-element">Start playing!</button>
        </div>
      </div>

      <div class="parameters-content is-hidden">
        <h1>Adjust parameters</h1>

        <div class="columns">
          <div class="column">
            <fieldset>
              <legend class="sr-only">Distance parameters</legend>

              <div class="control range" role="group">
                <label for="min-distance">Minimum distance</label>
                <input type="range" min="1" max="20" id="min-distance" aria-describedby="min-distance-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="min-distance-description">Minimum allowed distance between adjacent nodes. Lower values create smoother, more detailed curves but reduce performance. Higher values create chunkier, less organic shapes.</div>
              </div>

              <div class="control range" role="group">
                <label for="max-distance">Maximum distance</label>
                <input type="range" min="1" max="20" id="max-distance" aria-describedby="max-distance-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="max-distance-description">Maximum distance before a new node is inserted between two neighbors. Lower values create denser growth patterns with more nodes. Higher values allow looser, more sparse structures.</div>
              </div>

              <div class="control range" role="group">
                <label for="repulsion-radius">Repulsion radius</label>
                <input type="range" min="1" max="20" id="repulsion-radius" aria-describedby="repulsion-radius-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="repulsion-radius-description">How far each node can "sense" and push away from nearby nodes. Larger values prevent paths from overlapping but create more spread-out forms. Smaller values allow tighter, more compact growth.</div>
              </div>
            </fieldset>

            <fieldset>
              <legend class="sr-only">Force parameters</legend>

              <div class="control range" role="group">
                <label for="attraction-force">Attraction force</label>
                <input type="range" min=".01" max="1" step=".01" id="attraction-force" aria-describedby="attraction-force-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="attraction-force-description">How strongly each node pulls toward its connected neighbors on the path. Higher values keep the path cohesive and prevent it from breaking apart. Lower values allow more flexible, wandering growth.</div>
              </div>

              <div class="control range" role="group">
                <label for="repulsion-force">Repulsion force</label>
                <input type="range" min=".01" max="1" step=".01" id="repulsion-force" aria-describedby="repulsion-force-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="repulsion-force-description">How strongly nodes push away from nearby nodes within the repulsion radius. Higher values create more dramatic undulations and prevent overlapping. Lower values allow tighter, more tangled structures.</div>
              </div>

              <div class="control range" role="group">
                <label for="alignment-force">Alignment force</label>
                <input type="range" min=".01" max="1" step=".01" id="alignment-force" aria-describedby="alignment-force-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="alignment-force-description">How strongly each node tries to align with its connected neighbors to form smoother curves. Higher values reduce sharp angles and create flowing lines. Lower values allow more erratic, jagged growth patterns.</div>
              </div>
            </fieldset>
          </div>

          <div class="column">
            <fieldset>
              <legend>Visual modes</legend>

              <div class="control">
                <input type="checkbox" id="draw-nodes" class="sr-only">
                <label for="draw-nodes" title="Show individual nodes as small circles">Draw nodes</label>
              </div>

              <div class="control">
                <input type="checkbox" id="fill-mode" class="sr-only">
                <label for="fill-mode" title="Fill closed shapes with solid color">Fill shapes</label>
              </div>

              <div class="control">
                <input type="checkbox" id="debug-mode" class="sr-only">
                <label for="debug-mode" title="Show colored lines between nodes for debugging">Debug mode</label>
              </div>

              <div class="control">
                <input type="checkbox" id="trace-mode" class="sr-only">
                <label for="trace-mode" title="Don't clear the canvas each frame, creating trailing effect">Trace effect</label>
              </div>
            </fieldset>

            <fieldset>
              <legend>History effect</legend>

              <div class="control">
                <input type="checkbox" id="draw-history" class="sr-only">
                <label for="draw-history" title="Show previous growth stages like tree rings">History effect</label>
              </div>

              <div class="control range" role="group">
                <label for="history-capture-interval">History capture interval (in ms)</label>
                <input type="range" min="10" max="2000" step="10" id="history-capture-interval" aria-describedby="history-interval-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="history-interval-description">How often to capture a snapshot (in milliseconds). Lower values create more densely packed history layers. Higher values show wider gaps between growth stages.</div>
              </div>

              <div class="control range" role="group">
                <label for="max-history-size">Max history size</label>
                <input type="range" min="1" max="20" step="1" id="max-history-size" aria-describedby="max-history-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="max-history-description">Maximum number of historical snapshots to keep. More snapshots show more growth history but may impact performance.</div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Brownian motion</legend>

              <div class="control">
                <input type="checkbox" id="use-brownian-motion" class="sr-only">
                <label for="use-brownian-motion" title="Add random jitter to node positions for organic variation">Use Brownian motion</label>
              </div>

              <div class="control range" role="group">
                <label for="brownian-motion-range">Displacement range</label>
                <input type="range" min=".01" max=".1" step=".01" id="brownian-motion-range" aria-describedby="brownian-motion-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="brownian-motion-description">Amount of random "jiggling" applied to each node. Higher values create more chaotic, irregular edges. Lower values produce smoother, more controlled growth. Adds organic imperfection.</div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Simulation speed</legend>

              <div class="control range" role="group">
                <label for="time-scale">Time scale</label>
                <input type="range" min="1" max="50" step="1" id="time-scale" aria-describedby="time-scale-description">
                <span class="value" aria-hidden="true"></span>
                <div class="description" id="time-scale-description">Speed multiplier for the simulation. 1x is normal speed, higher values run the simulation faster by performing multiple growth iterations per frame. Useful for quickly exploring growth patterns.</div>
              </div>
            </fieldset>
          </div>
        </div>

        <button class="reset-params last-focusable-element">Reset to Defaults</button>
      </div>
    </div>

  </div>

  <aside class="left-menu toolbar">
    <ul>
      <li>
        <button class="freehand button" aria-label="Freehand" aria-current="true">
          <span class="icon fas fa-pencil-alt"></span>
          <span class="text">Freehand</span>
        </button>
      </li>

      <li>
        <button class="rectangle button" aria-label="Draw rectangle">
          <span class="icon far fa-square"></span>
          <span class="text">Draw rectangle</span>
        </button>
      </li>

      <li>
        <button class="circle button" aria-label="Draw circle">
          <span class="icon far fa-circle"></span>
          <span class="text">Draw circle</span>
        </button>
      </li>

      <li>
        <button class="import button" aria-label="Import SVG">
          <span class="icon far fa-folder-open"></span>
          <span class="text">Import SVG</span>
        </button>
      </li>

      <li>
        <button class="reset button" aria-label="Erase all">
          <span class="icon fas fa-eraser"></span>
          <span class="text">Erase all</span>
        </button>
      </li>

      <li>
        <button class="export button" aria-label="Download SVG">
          <span class="icon fas fa-download"></span>
          <span class="text">Download SVG</span>
        </button>
      </li>
    </ul>

  </aside>

  <div class="top-controls">
    <button class="play button">
      <span class="icon fas fa-play" aria-hidden="true"></span>
      <span class="text sr-only">Play</span>
    </button>
  </div>

  <div class="speed-indicator">
    <span class="speed-value">1x</span>
  </div>

  <aside class="right-menu toolbar">
    <ul>
      <li>
        <button class="keyboard button" aria-label="Keyboard controls">
          <span class="text">Keyboard controls</span>
          <span class="icon fas fa-keyboard"></span>
        </button>
      </li>

      <li>
        <button class="about button" aria-label="About">
          <span class="text">About</span>
          <span class="icon fas fa-question"></span>
        </button>
      </li>

      <li>
        <button class="parameters button" aria-label="Adjust parameters">
          <span class="text">Adjust parameters</span>
          <span class="icon fas fa-sliders-h"></span>
        </button>
      </li>
    </ul>

  </aside>

  <div id="canvas-container">
    <div id="p5-canvas"></div>
  </div>

  <input type="file" class="svgImportInput" accept=".svg" hidden aria-label="user uploaded file">
  <object id="user-file" type="image/svg+xml" aria-hidden="true" tabindex="-1"></object>
</div>
