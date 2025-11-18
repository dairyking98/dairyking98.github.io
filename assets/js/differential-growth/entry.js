let Node = require("./Node"),
  Path = require("./Path"),
  World = require("./World"),
  SVGLoader = require("./SVGLoader"),
  Settings = require("./Settings"),
  ParametersPanel = require("./ParametersPanel");

let world,
  path,
  nodes = [];

const FREEHAND = 0,
  RECTANGLE = 1,
  CIRCLE = 2;
let activeTool = FREEHAND;

let distanceToClose = 10;

let startX, startY, endX, endY, deltaX, deltaY;
let wasPlayingBeforeDrawing = false;
let isDrawing = false;

let allButtonEls = document.querySelectorAll("button"),
  svgImportInputEl = document.querySelector(".svgImportInput"),
  playButtonEl = document.querySelector(".play");

let modalEl = document.querySelector(".modal"),
  triggeringEl,
  firstFocusableElement,
  lastFocusableElement,
  backdropClickHandler = null;

let speedIndicatorEl = document.querySelector(".speed-indicator .speed-value"),
  speedIndicatorContainer = document.querySelector(".speed-indicator");

/*
=============================================================================
  p5.js sketch
=============================================================================
*/

const sketch = function (p5) {
  // Setup -------------------------------------------------------------
  p5.setup = function () {
    console.log("p5.setup called");
    const container = document.getElementById("p5-canvas");
    if (!container) {
      console.error("p5-canvas container not found");
      return;
    }
    console.log("Container found:", container);

    // Use full window dimensions below navbar (60px)
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight - 60;

    const canvas = p5.createCanvas(containerWidth, containerHeight);
    console.log("Canvas created:", canvas, "size:", containerWidth, "x", containerHeight);
    canvas.parent("p5-canvas");
    p5.colorMode(p5.HSB, 255);
    p5.rectMode(p5.CENTER);
    p5.smooth();
    console.log("Canvas setup complete");

    // Set up and start the simulation
    try {
      world = new World(p5, Settings);
      world.pause();
      console.log("World created successfully");

      // Set up the Parameters window
      let paramPanel = new ParametersPanel(world);
      console.log("ParametersPanel created successfully");

      // Update speed indicator with loaded value
      if (speedIndicatorEl) {
        speedIndicatorEl.innerHTML = world.settings.TimeScale + "x";
        // Hide if speed is 1x
        if (speedIndicatorContainer) {
          if (world.settings.TimeScale === 1) {
            speedIndicatorContainer.classList.add("hidden");
          } else {
            speedIndicatorContainer.classList.remove("hidden");
          }
        }
      }
    } catch (err) {
      console.error("Error creating World or ParametersPanel:", err);
    }

    // Wait a bit for DOM to be fully ready, then set up event listeners
    setTimeout(function () {
      // Left menu ----------------------
      // Drawing tools
      const freehand = document.querySelector(".freehand");
      const rectangle = document.querySelector(".rectangle");
      const circle = document.querySelector(".circle");

      if (freehand) freehand.addEventListener("click", handleToolClick);
      if (rectangle) rectangle.addEventListener("click", handleToolClick);
      if (circle) circle.addEventListener("click", handleToolClick);

      // Import, export, and clear
      const importBtn = document.querySelector(".import");
      const resetBtn = document.querySelector(".reset");
      const exportBtn = document.querySelector(".export");

      if (importBtn) importBtn.addEventListener("click", openFileImport);
      if (resetBtn) resetBtn.addEventListener("click", clearPaths);
      if (exportBtn) exportBtn.addEventListener("click", exportSVG);

      // Center controls ----------------
      const playBtn = document.querySelector(".play");
      if (playBtn) playBtn.addEventListener("click", togglePause);

      // Right menu ---------------------
      const keyboardBtn = document.querySelector(".keyboard");
      const aboutBtn = document.querySelector(".about");
      const parametersBtn = document.querySelector(".parameters");

      if (keyboardBtn) keyboardBtn.addEventListener("click", toggleKeyboardControls);
      if (aboutBtn) aboutBtn.addEventListener("click", toggleAbout);
      if (parametersBtn) parametersBtn.addEventListener("click", toggleParameters);

      // Other functions ----------------
      const svgInput = document.querySelector(".svgImportInput");
      const startBtn = document.querySelector(".start");
      const resetParamsBtn = document.querySelector(".reset-params");

      if (svgInput) svgInput.addEventListener("change", importSVG);
      if (startBtn) startBtn.addEventListener("click", closeModal);
      if (resetParamsBtn) resetParamsBtn.addEventListener("click", resetParameters);

      console.log("Event listeners attached");
      console.log("Buttons found:", {
        freehand: !!freehand,
        rectangle: !!rectangle,
        circle: !!circle,
        play: !!playBtn,
        keyboard: !!keyboardBtn,
      });
    }, 200);
  };

  // Draw ---------------------------------------------------------------
  p5.draw = function () {
    if (!world) return;

    if (!world.paused) {
      // Apply time scale by iterating multiple times per frame
      const iterations = Math.floor(world.timeScale);
      for (let i = 0; i < iterations; i++) {
        world.iterate();
      }
      world.draw();
    }
  };

  p5.windowResized = function () {
    p5.resizeCanvas(window.innerWidth, window.innerHeight - 60);
    if (world) {
      world.drawBackground();
    }
  };

  /*
  =============================================================================
    Custom functions
  =============================================================================
  */
  function setActiveTool(tool) {
    for (let button of allButtonEls) {
      button.removeAttribute("aria-current");
    }

    switch (tool) {
      case FREEHAND:
        document.querySelector(".freehand").setAttribute("aria-current", true);
        break;
      case RECTANGLE:
        document.querySelector(".rectangle").setAttribute("aria-current", true);
        break;
      case CIRCLE:
        document.querySelector(".circle").setAttribute("aria-current", true);
        break;
    }

    activeTool = tool;
  }

  // Set active tool based on which tool icon was clicked
  function handleToolClick(e) {
    // Use currentTarget to get the button element, not the icon/text span that was clicked
    const button = e.currentTarget;
    if (button.classList.contains("freehand")) {
      setActiveTool(FREEHAND);
    } else if (button.classList.contains("rectangle")) {
      setActiveTool(RECTANGLE);
    } else if (button.classList.contains("circle")) {
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

    let icon = playButtonEl.querySelector(".icon");
    let text = playButtonEl.querySelector(".text");

    if (world.paused) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
      text.innerHTML = "Play";
    } else {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-pause");
      text.innerHTML = "Pause";
    }
  }

  // Keyboard icon - toggle keyboard controls modal window
  function toggleKeyboardControls() {
    triggeringEl = document.querySelector(".keyboard");
    openModal("keyboard-controls");
  }

  // Question mark icon - toggle 'about' modal window
  function toggleAbout() {
    triggeringEl = document.querySelector(".about");
    openModal("about");
  }

  // Sliders icon - toggle parameters modal window
  function toggleParameters() {
    triggeringEl = document.querySelector(".parameters");
    openModal("parameters");
  }

  function openModal(modal) {
    let allContentEls = modalEl.querySelectorAll(".modal-content > div:not(.close)");

    for (let contentEl of allContentEls) {
      contentEl.classList.add("is-hidden");
    }

    modalEl.querySelector("." + modal + "-content").classList.remove("is-hidden");
    modalEl.classList.add("is-visible");

    // Remove old backdrop listener if it exists
    if (backdropClickHandler) {
      modalEl.removeEventListener("click", backdropClickHandler);
    }

    // Create and store new listener on the modal container itself
    backdropClickHandler = function (e) {
      // Don't close if we're in the middle of drawing
      if (isDrawing) {
        return;
      }
      // Only close if clicking outside the modal-content
      const modalContent = modalEl.querySelector(".modal-content");
      if (!modalContent.contains(e.target)) {
        closeModal();
      }
    };

    modalEl.addEventListener("click", backdropClickHandler);
    modalEl.querySelector(".close").addEventListener("click", closeModal);

    modalEl.addEventListener("keydown", function (e) {
      if (e.key == "Escape") {
        closeModal();
      }

      // Prevent spacebar from triggering the close button when it's focused
      if (e.key == " " || e.key == "Spacebar") {
        // Only allow spacebar on actual interactive elements like Apply button
        if (e.target.classList.contains("close")) {
          e.preventDefault();
        }
      }

      if (modal === "keyboard-controls") {
        if (e.key == "Tab") {
          e.preventDefault();
        }
      } else {
        firstFocusableElement = modalEl.querySelector(".first-focusable-element");
        lastFocusableElement = modalEl.querySelector("." + modal + "-content").querySelector(".last-focusable-element");

        if (e.target == firstFocusableElement && e.key == "Tab" && e.shiftKey) {
          e.preventDefault();
          lastFocusableElement.focus();
        } else if (e.target == lastFocusableElement && e.key == "Tab" && !e.shiftKey) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    });

    // Don't auto-focus the close button to avoid spacebar accidentally closing the modal
    // Users can still click it or press Escape to close
    // modalEl.querySelector(".close").focus();
  }

  function closeModal() {
    modalEl.classList.remove("is-visible");

    // Clean up modal listener
    if (backdropClickHandler) {
      modalEl.removeEventListener("click", backdropClickHandler);
      backdropClickHandler = null;
    }

    if (triggeringEl) {
      triggeringEl.focus();
    }
  }

  // Reset parameters to defaults
  function resetParameters() {
    // Clear all saved settings from localStorage
    localStorage.removeItem("differential-growth-timeScale");
    
    // Reload the page to reset everything
    window.location.reload();
  }

  // Parse SVG file from user input and add to World
  function importSVG() {
    let file = this.files[0];

    if (file.type === "image/svg+xml") {
      let reader = new FileReader();

      // When a file is loaded, convert it from a raw text string to a DOM tree, then parse it for Paths and add to World
      reader.onload = function () {
        let parser = new DOMParser();
        let svgNode = parser.parseFromString(reader.result, "image/svg+xml");
        let paths = SVGLoader.load(p5, svgNode, Settings);
        world.addPaths(paths);
        world.draw();
      };

      // Read the contents of the uploaded file as a raw text string
      reader.readAsText(file);
    }

    // Blur the focus on the button so it isn't accidentally retriggered on 'Space'
    document.querySelector(".import").blur();
  }

  /*
  =============================================================================
    Mouse handlers
  =============================================================================
  */

  p5.mousePressed = function (event) {
    // Don't draw if clicking inside the modal content
    const modal = document.querySelector(".modal.is-visible");
    if (modal) {
      const modalContent = modal.querySelector(".modal-content");
      const rect = modalContent.getBoundingClientRect();
      if (p5.mouseX >= rect.left && p5.mouseX <= rect.right && p5.mouseY >= rect.top && p5.mouseY <= rect.bottom) {
        return;
      }
    }

    // Prevent default to avoid text selection
    if (event) event.preventDefault();

    console.log("mousePressed", p5.mouseX, p5.mouseY, "activeTool:", activeTool);

    // Mark that we're starting to draw
    isDrawing = true;

    switch (activeTool) {
      // Rectangle tool -----------------------------------
      case RECTANGLE:
      case CIRCLE:
        // Track if it was playing before we start drawing
        if (!world.paused) {
          console.log("mousePressed: Setting wasPlayingBeforeDrawing = true and pausing");
          wasPlayingBeforeDrawing = true;
          world.pause();

          // Update play button UI
          if (playButtonEl) {
            let icon = playButtonEl.querySelector(".icon");
            let text = playButtonEl.querySelector(".text");
            if (icon && text) {
              icon.classList.remove("fa-pause");
              icon.classList.add("fa-play");
              text.innerHTML = "Play";
            }
          }
        }

        startX = p5.mouseX;
        startY = p5.mouseY;
        break;
    }
  };

  p5.mouseReleased = function (event) {
    if (!world) return;

    // Don't draw if clicking inside the modal content
    const modal = document.querySelector(".modal.is-visible");
    if (modal) {
      const modalContent = modal.querySelector(".modal-content");
      const rect = modalContent.getBoundingClientRect();
      if (p5.mouseX >= rect.left && p5.mouseX <= rect.right && p5.mouseY >= rect.top && p5.mouseY <= rect.bottom) {
        return;
      }
    }

    // Prevent default to avoid text selection
    if (event) event.preventDefault();

    switch (activeTool) {
      // Freehand tool ------------------------------------
      case FREEHAND:
        if (p5.mouseButton == p5.LEFT) {
          if (nodes.length == 0) {
            return;
          }

          let isClosed = false,
            firstNode = nodes[0],
            lastNode = nodes[nodes.length - 1];

          // If end point is very close to starting point, make the path closed
          if (lastNode.distance(firstNode) <= distanceToClose) {
            isClosed = true;
          }

          // Create and add Path to the World
          path = new Path(p5, nodes, world.settings, isClosed);
          world.addPath(path);

          nodes = [];
        }

        break;

      // Rectangle tool -----------------------------------
      case RECTANGLE:
        endX = p5.mouseX;
        endY = p5.mouseY;

        nodes.push(new Node(p5, startX, startY, world.settings)); // top left
        nodes.push(new Node(p5, endX, startY, world.settings)); // top right
        nodes.push(new Node(p5, endX, endY, world.settings)); // bottom right
        nodes.push(new Node(p5, startX, endY, world.settings)); // bottom left

        path = new Path(p5, nodes, world.settings, true);
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
              startX + deltaX / 2 + (deltaX / 2) * Math.cos((i * Math.PI) / 180),
              startY + deltaY / 2 + (deltaY / 2) * Math.sin((i * Math.PI) / 180),
              world.settings
            )
          );
        }

        path = new Path(p5, nodes, world.settings, true);
        world.addPath(path);

        nodes = [];
        break;
    }

    world.draw();

    // Resume playing if it was playing before drawing started
    console.log("mouseReleased end: wasPlayingBeforeDrawing =", wasPlayingBeforeDrawing);
    if (wasPlayingBeforeDrawing) {
      console.log("Auto-resuming playback");
      world.unpause();
      wasPlayingBeforeDrawing = false;

      // Update play button UI
      if (playButtonEl) {
        let icon = playButtonEl.querySelector(".icon");
        let text = playButtonEl.querySelector(".text");
        if (icon && text) {
          icon.classList.remove("fa-play");
          icon.classList.add("fa-pause");
          text.innerHTML = "Pause";
        }
      }
    }

    // Mark that we're done drawing (delay slightly to ensure event processing completes)
    setTimeout(() => {
      isDrawing = false;
    }, 100);
  };

  p5.mouseDragged = function (event) {
    if (!world) return;

    // Don't draw if clicking inside the modal content
    const modal = document.querySelector(".modal.is-visible");
    if (modal) {
      const modalContent = modal.querySelector(".modal-content");
      const rect = modalContent.getBoundingClientRect();
      if (p5.mouseX >= rect.left && p5.mouseX <= rect.right && p5.mouseY >= rect.top && p5.mouseY <= rect.bottom) {
        return;
      }
    }

    // Prevent default to avoid text selection
    if (event) event.preventDefault();

    // Mark that we're drawing
    isDrawing = true;

    // Track if it was playing before we pause it for drawing
    if (!world.paused) {
      console.log("mouseDragged: Setting wasPlayingBeforeDrawing = true and pausing");
      wasPlayingBeforeDrawing = true;
      world.pause();

      // Update play button UI
      if (playButtonEl) {
        let icon = playButtonEl.querySelector(".icon");
        let text = playButtonEl.querySelector(".text");
        if (icon && text) {
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
          text.innerHTML = "Play";
        }
      }
    }

    world.draw();

    switch (activeTool) {
      // Freehand tool ------------------------------------
      case FREEHAND:
        if (p5.mouseButton == p5.LEFT) {
          nodes.push(new Node(p5, p5.mouseX, p5.mouseY, world.settings));
          console.log("Freehand: added node", nodes.length, "at", p5.mouseX, p5.mouseY);

          if (nodes.length > 0) {
            for (let [index, node] of nodes.entries()) {
              if (index > 0) {
                p5.stroke(0);
                p5.line(nodes[index - 1].x, nodes[index - 1].y, node.x, node.y);
              }
            }
          }

          let firstNode = nodes[0],
            lastNode = nodes[nodes.length - 1];

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
  };

  /*
  =============================================================================
    Key handler
  =============================================================================
  */
  p5.keyReleased = function (event) {
    // Prevent spacebar from triggering focused buttons (like the modal close button)
    if (p5.key === " " && event) {
      event.preventDefault();
    }

    switch (p5.key) {
      // Toggle trace mode with 't'
      case "t":
        world.toggleTraceMode();
        break;

      // Toggle drawing of nodes with 'n'
      case "n":
        world.toggleDrawNodes();
        break;

      // Reset simulation with current parameters with 'r'
      case "r":
        world.clearPaths();
        world.drawBackground();
        break;

      // Toggle pause with Space
      case " ":
        togglePause();
        break;

      // Toggle debug mode with 'd'
      case "d":
        world.toggleDebugMode();
        break;

      // Toggle fill for all shapes with 'f'
      case "f":
        world.toggleFillMode();
        break;

      // Toggle path history with 'h'
      case "h":
        world.toggleDrawHistory();
        break;

      // Export SVG with 's'
      case "s":
        world.export();
        break;

      // Toggle visibility of all bounds for all paths with 'b'
      case "b":
        world.toggleDrawBounds();
        break;
    }
  };
};

// Launch the sketch using p5js in instantiated mode when DOM is ready
function initPlayground() {
  console.log("initPlayground called, document.readyState:", document.readyState);
  // Wait for DOM to be fully ready
  if (document.readyState === "loading") {
    console.log("DOM still loading, waiting for DOMContentLoaded");
    document.addEventListener("DOMContentLoaded", function () {
      console.log("DOMContentLoaded fired, creating p5 instance");
      setTimeout(function () {
        new p5(sketch);
      }, 100);
    });
  } else {
    console.log("DOM already ready, creating p5 instance");
    setTimeout(function () {
      new p5(sketch);
    }, 100);
  }
}

try {
  console.log("Differential growth bundle loaded");
  initPlayground();
} catch (err) {
  console.error("FATAL ERROR in differential growth bundle:", err);
  console.error("Stack:", err.stack);
}
