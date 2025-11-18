let Node = require('./Node'),
  Path = require('./Path'),
  World = require('./World'),
  SVGLoader = require('./SVGLoader'),
  Settings = require('./Settings'),
  ParametersPanel = require('./ParametersPanel');

let world,
    path,
    nodes = [];

const FREEHAND = 0,
      RECTANGLE = 1,
      CIRCLE = 2;
let activeTool = FREEHAND;

let distanceToClose = 10;

let startX, startY, endX, endY, deltaX, deltaY;

let allButtonEls = document.querySelectorAll('button'),
    svgImportInputEl = document.querySelector('.svgImportInput'),
    playButtonEl = document.querySelector('.play');

let modalEl = document.querySelector('.modal'),
    triggeringEl,
    firstFocusableElement, lastFocusableElement;


/*
=============================================================================
  p5.js sketch
=============================================================================
*/

const sketch = function (p5) {
  // Setup -------------------------------------------------------------
  p5.setup = function () {
    console.log('p5.setup called');
    const container = document.getElementById('p5-canvas');
    if (!container) {
      console.error('p5-canvas container not found');
      return;
    }
    console.log('Container found:', container);
    
    // Use full window dimensions below navbar (60px)
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight - 60;
    
    const canvas = p5.createCanvas(containerWidth, containerHeight);
    console.log('Canvas created:', canvas, 'size:', containerWidth, 'x', containerHeight);
    canvas.parent('p5-canvas');
    p5.colorMode(p5.HSB, 255);
    p5.rectMode(p5.CENTER);
    p5.smooth();
    console.log('Canvas setup complete');

    // Set up and start the simulation
    try {
      world = new World(p5, Settings);
      world.pause();
      console.log('World created successfully');

      // Set up the Parameters window
      let paramPanel = new ParametersPanel(world);
      console.log('ParametersPanel created successfully');
    } catch (err) {
      console.error('Error creating World or ParametersPanel:', err);
    }

    // Wait a bit for DOM to be fully ready, then set up event listeners
    setTimeout(function() {
      // Left menu ----------------------
      // Drawing tools
      const freehand = document.querySelector('.freehand');
      const rectangle = document.querySelector('.rectangle');
      const circle = document.querySelector('.circle');
      
      if (freehand) freehand.addEventListener('click', handleToolClick);
      if (rectangle) rectangle.addEventListener('click', handleToolClick);
      if (circle) circle.addEventListener('click', handleToolClick);

      // Import, export, and clear
      const importBtn = document.querySelector('.import');
      const resetBtn = document.querySelector('.reset');
      const exportBtn = document.querySelector('.export');
      
      if (importBtn) importBtn.addEventListener('click', openFileImport);
      if (resetBtn) resetBtn.addEventListener('click', clearPaths);
      if (exportBtn) exportBtn.addEventListener('click', exportSVG);

      // Center controls ----------------
      const playBtn = document.querySelector('.play');
      if (playBtn) playBtn.addEventListener('click', togglePause);

      // Right menu ---------------------
      const keyboardBtn = document.querySelector('.keyboard');
      const aboutBtn = document.querySelector('.about');
      const parametersBtn = document.querySelector('.parameters');
      
      if (keyboardBtn) keyboardBtn.addEventListener('click', toggleKeyboardControls);
      if (aboutBtn) aboutBtn.addEventListener('click', toggleAbout);
      if (parametersBtn) parametersBtn.addEventListener('click', toggleParameters);

      // Other functions ----------------
      const svgInput = document.querySelector('.svgImportInput');
      const startBtn = document.querySelector('.start');
      
      if (svgInput) svgInput.addEventListener('change', importSVG);
      if (startBtn) startBtn.addEventListener('click', closeModal);
      
      console.log('Event listeners attached');
      console.log('Buttons found:', {
        freehand: !!freehand,
        rectangle: !!rectangle,
        circle: !!circle,
        play: !!playBtn,
        keyboard: !!keyboardBtn
      });
    }, 200);
  }

  // Draw ---------------------------------------------------------------
  p5.draw = function () {
    if (!world) return;
    
    if (!world.paused) {
      world.iterate();
      world.draw();
    }
  }

  p5.windowResized = function() {
    p5.resizeCanvas(window.innerWidth, window.innerHeight - 60);
    if (world) {
      world.drawBackground();
    }
  }


  /*
  =============================================================================
    Custom functions
  =============================================================================
  */
  function setActiveTool(tool) {
    for (let button of allButtonEls) {
      button.removeAttribute('aria-current');
    }

    switch (tool) {
      case FREEHAND:
        document.querySelector('.freehand').setAttribute('aria-current', true);
        break;
      case RECTANGLE:
        document.querySelector('.rectangle').setAttribute('aria-current', true);
        break;
      case CIRCLE:
        document.querySelector('.circle').setAttribute('aria-current', true);
        break;
    }

    activeTool = tool;
  }

  // Set active tool based on which tool icon was clicked
  function handleToolClick(e) {
    // Use currentTarget to get the button element, not the icon/text span that was clicked
    const button = e.currentTarget;
    if (button.classList.contains('freehand')) {
      setActiveTool(FREEHAND);
    } else if (button.classList.contains('rectangle')) {
      setActiveTool(RECTANGLE);
    } else if (button.classList.contains('circle')) {
      setActiveTool(CIRCLE);
    }
  }

  // Import SVG - open file input dialog
  function openFileImport() {
    svgImportInputEl.click();
  }

  // Eraser - clear all paths from the world
  function clearPaths() {
    world.clearPaths();
    world.drawBackground();
  }

  // Download SVG - export world contents as SVG
  function exportSVG() {
    world.export();
  }


  // Play button - toggle pause/unpause of world
  function togglePause() {
    world.togglePause();

    let icon = playButtonEl.querySelector('.icon');
    let text = playButtonEl.querySelector('.text');

    if (world.paused) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      text.innerHTML = 'Play';
    } else {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
      text.innerHTML = 'Pause';
    }
  }

  // Keyboard icon - toggle keyboard controls modal window
  function toggleKeyboardControls() {
    triggeringEl = document.querySelector('.keyboard');
    openModal('keyboard-controls');
  }

  // Question mark icon - toggle 'about' modal window
  function toggleAbout() {
    triggeringEl = document.querySelector('.about');
    openModal('about');
  }


  // Sliders icon - toggle parameters modal window
  function toggleParameters() {
    triggeringEl = document.querySelector('.parameters');
    openModal('parameters');
  }

  function openModal(modal) {
    let allContentEls = modalEl.querySelectorAll('.modal-content > div:not(.close)');

    for(let contentEl of allContentEls) {
      contentEl.classList.add('is-hidden');
    }

    modalEl.querySelector('.' + modal + '-content').classList.remove('is-hidden');
    modalEl.classList.add('is-visible');

    modalEl.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modalEl.querySelector('.close').addEventListener('click', closeModal);

    modalEl.addEventListener('keydown', function(e) {
      if(e.key == 'Escape') {
        closeModal();
      }

      if(modal === 'keyboard-controls') {
        if(e.key == 'Tab') {
          e.preventDefault();
        }
      } else {
        firstFocusableElement = modalEl.querySelector('.first-focusable-element');
        lastFocusableElement = modalEl.querySelector('.' + modal + '-content').querySelector('.last-focusable-element');

        if(e.target == firstFocusableElement && e.key == 'Tab' && e.shiftKey) {
          e.preventDefault();
          lastFocusableElement.focus();
        } else if(e.target == lastFocusableElement && e.key == 'Tab' && !e.shiftKey) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    });

    modalEl.querySelector('.close').focus();
  }

  function closeModal() {
    modalEl.classList.remove('is-visible');
    if (triggeringEl) {
      triggeringEl.focus();
    }
  }

  // Parse SVG file from user input and add to World
  function importSVG() {
    let file = this.files[0];

    if (file.type === 'image/svg+xml') {
      let reader = new FileReader();

      // When a file is loaded, convert it from a raw text string to a DOM tree, then parse it for Paths and add to World
      reader.onload = function () {
        let parser = new DOMParser();
        let svgNode = parser.parseFromString(reader.result, "image/svg+xml");
        let paths = SVGLoader.load(p5, svgNode, Settings);
        world.addPaths(paths);
        world.draw();
      }

      // Read the contents of the uploaded file as a raw text string
      reader.readAsText(file);
    }

    // Blur the focus on the button so it isn't accidentally retriggered on 'Space'
    document.querySelector('.import').blur();
  }


  /*
  =============================================================================
    Mouse handlers
  =============================================================================
  */

  p5.mousePressed = function () {
    console.log('mousePressed', p5.mouseX, p5.mouseY, 'activeTool:', activeTool);
    switch (activeTool) {
      // Rectangle tool -----------------------------------
      case RECTANGLE:
      case CIRCLE:
        startX = p5.mouseX;
        startY = p5.mouseY;
        break;
    }
  }

  p5.mouseReleased = function () {
    if (!world) return;
    
    switch (activeTool) {
      // Freehand tool ------------------------------------
      case FREEHAND:
        if (p5.mouseButton == p5.LEFT) {
          if (nodes.length == 0) {
            return;
          }

          let isClosed = false,
              firstNode = nodes[0],
              lastNode = nodes[nodes.length-1];

          // If end point is very close to starting point, make the path closed
          if (lastNode.distance(firstNode) <= distanceToClose) {
            isClosed = true;
          }

          // Create and add Path to the World
          path = new Path(p5, nodes, Settings, isClosed);
          world.addPath(path);

          nodes = [];
        }

        break;

      // Rectangle tool -----------------------------------
      case RECTANGLE:
        endX = p5.mouseX;
        endY = p5.mouseY;

        nodes.push(new Node(p5, startX, startY, Settings)); // top left
        nodes.push(new Node(p5, endX, startY, Settings)); // top right
        nodes.push(new Node(p5, endX, endY, Settings)); // bottom right
        nodes.push(new Node(p5, startX, endY, Settings)); // bottom left

        path = new Path(p5, nodes, Settings, true);
        world.addPath(path);

        nodes = [];
        break;

      // Circle tool --------------------------------------
      case CIRCLE:
        endX = p5.mouseX;
        endY = p5.mouseY;
        deltaX = endX - startX;
        deltaY = endY - startY;

        for (let i = 0; i < 360; i++) {
          nodes.push(
            new Node(
              p5,
              startX + deltaX / 2 + (deltaX / 2 * Math.cos(i * Math.PI / 180)),
              startY + deltaY / 2 + (deltaY / 2 * Math.sin(i * Math.PI / 180)),
              Settings
            )
          )
        }

        path = new Path(p5, nodes, Settings, true);
        world.addPath(path);

        nodes = [];
        break;
    }

    world.draw();
  }

  p5.mouseDragged = function () {
    if (!world) return;
    
    if (!world.paused) {
      world.pause();
    }

    world.draw();

    switch (activeTool) {
      // Freehand tool ------------------------------------
      case FREEHAND:
        if (p5.mouseButton == p5.LEFT) {
          nodes.push(new Node(p5, p5.mouseX, p5.mouseY, Settings));
          console.log('Freehand: added node', nodes.length, 'at', p5.mouseX, p5.mouseY);

          if (nodes.length > 0) {
            for (let [index, node] of nodes.entries()) {
              if (index > 0) {
                p5.stroke(0);
                p5.line(nodes[index - 1].x, nodes[index - 1].y, node.x, node.y);
              }
            }
          }

          let firstNode = nodes[0],
              lastNode = nodes[nodes.length-1];

          // If current point is very near the starting point, highlight the starting point to indicate that the path will close
          if (lastNode.distance(firstNode) <= distanceToClose) {
            p5.fill(150);
            p5.noStroke();
            p5.ellipseMode(p5.CENTER);
            p5.ellipse(nodes[0].x, nodes[0].y, distanceToClose * 2);
          }
        }

        break;

        // Rectangle tool -----------------------------------
      case RECTANGLE:
        if (p5.mouseButton == p5.LEFT) {
          p5.stroke(0);
          p5.line(startX, startY, p5.mouseX, startY); // top
          p5.line(p5.mouseX, startY, p5.mouseX, p5.mouseY); // right
          p5.line(p5.mouseX, p5.mouseY, startX, p5.mouseY); // bottom
          p5.line(startX, p5.mouseY, startX, startY); // left
        }

        break;

        // Circle tool --------------------------------------
      case CIRCLE:
        if (p5.mouseButton == p5.LEFT && startX != undefined && startY != undefined) {
          p5.stroke(0);
          p5.noFill();
          p5.ellipseMode(p5.CORNERS);
          p5.ellipse(startX, startY, p5.mouseX, p5.mouseY);
        }
    }
  }


  /*
  =============================================================================
    Key handler
  =============================================================================
  */
  p5.keyReleased = function () {
    switch (p5.key) {
      // Toggle trace mode with 't'
      case 't':
        world.toggleTraceMode()
        break;

        // Toggle drawing of nodes with 'n'
      case 'n':
        world.toggleDrawNodes();
        break;

        // Reset simulation with current parameters with 'r'
      case 'r':
        world.clearPaths();
        world.drawBackground();
        break;

        // Toggle pause with Space
      case ' ':
        togglePause()
        break;

        // Invert colors with 'i'
      case 'i':
        world.toggleInvertedColors();
        break;

        // Toggle debug mode with 'd'
      case 'd':
        world.toggleDebugMode()
        break;

        // Toggle fill for all shapes with 'f'
      case 'f':
        world.toggleFillMode();
        break;

        // Toggle path history with 'h'
      case 'h':
        world.toggleDrawHistory();
        break;

        // Export SVG with 's'
      case 's':
        world.export();
        break;

        // Toggle visibility of all bounds for all paths with 'b'
      case 'b':
        world.toggleDrawBounds();
        break;
    }
  }
}

// Launch the sketch using p5js in instantiated mode when DOM is ready
function initPlayground() {
  console.log('initPlayground called, document.readyState:', document.readyState);
  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOMContentLoaded fired, creating p5 instance');
      setTimeout(function() {
        new p5(sketch);
      }, 100);
    });
  } else {
    console.log('DOM already ready, creating p5 instance');
    setTimeout(function() {
      new p5(sketch);
    }, 100);
  }
}

try {
  console.log('Differential growth bundle loaded');
  initPlayground();
} catch (err) {
  console.error('FATAL ERROR in differential growth bundle:', err);
  console.error('Stack:', err.stack);
}
