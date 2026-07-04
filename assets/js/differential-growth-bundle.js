(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        /** @module Bounds */

        let inside = require("point-in-polygon");

        /** Polygonal container for Paths that can constrain them to particular shapes */
        class Bounds {
          /**
           * Create a new Bounds object
           * @param {object} p5 Reference to global instance of p5.js for drawing
           * @param {array} polygon Array of sequential points in the format of [polygon_n][x1][y1], ...
           */
          constructor(p5, polygon) {
            this.p5 = p5;
            this.polygon = polygon;
          }

          /**
           * Test if a given point is within this Bounds polygon
           * @param {array} point Coordinates of point to test ([x,y])
           * @returns {boolean}
           */
          contains(point) {
            return inside(point, this.polygon);
          }

          /** Draws this Bounds polygon to the canvas */
          draw() {
            this.p5.beginShape();

            for (let i = 0; i < this.polygon.length; i++) {
              this.p5.vertex(this.polygon[i][0], this.polygon[i][1]);
            }

            this.p5.vertex(this.polygon[0][0], this.polygon[0][1]);

            this.p5.endShape();
          }
        }

        module.exports = Bounds;
      },
      { "point-in-polygon": 11 },
    ],
    2: [
      function (require, module, exports) {
        /** @module Defaults */

        module.exports = {
          /**
           * Minimum distance between nodes. Used in attraction, pruning, and injection
           * @type {number}
           */
          MinDistance: 2,

          /**
           * Maximum distance between nodes before they are split
           * @type {number}
           */
          MaxDistance: 5,

          /**
           * Radius to search for nearby nodes for repulsion force
           * @type {number}
           */
          RepulsionRadius: 15,

          /**
           * Maximum velocity at which a node can move per frame
           * @type {number}
           */
          MaxVelocity: 0.1,

          /**
           * Maximum attraction force between connected nodes
           * @type {number}
           */
          AttractionForce: 0.2,

          /**
           * Maximum repulsion force between nearby nodes
           * @type {number}
           */
          RepulsionForce: 0.6,

          /**
           * Maximum alignment force between connected nodes
           * @type {number}
           */
          AlignmentForce: 0.55,

          /**
           * Interval (in ms) between call to node injection routine
           * @type {number}
           */
          NodeInjectionInterval: 100,

          /**
           * Show/hide circles for each node
           * @type {boolean}
           */
          DrawNodes: false,

          /**
           * Allow accumulation of path growth by disabling background repaints
           * @type {boolean}
           */
          TraceMode: false,

          /**
           * Turn on/off debug mode (per-edge colors)
           * @type {boolean}
           */
          DebugMode: false,

          /**
           * Turn on/off shape fills for closed paths
           * @type {boolean}
           */
          FillMode: false,

          /**
           * Turn on/off capturing and rendering of previous node positions to create a "tree ring" effect
           * @type {boolean}
           */
          DrawHistory: false,

          /**
           * Interval (in ms) between capture of paths for history effect
           * @type {number}
           */
          HistoryCaptureInterval: 1000,

          /**
           * Maximum number of previous paths to capture for history effect
           * @type {number}
           */
          MaxHistorySize: 10,

          /**
           * Turn on/off Brownian motion
           * @type {boolean}
           */
          UseBrownianMotion: true,

          /**
           * Amount to 'jiggle' nodes when Brownian motion is enabled
           * @type {number}
           */
          BrownianMotionRange: 0.01,

          /**
           * Draw all boundaries
           * @type {boolean}
           */
          ShowBounds: true,

          /**
           * Time scale multiplier for simulation speed (1x = normal, higher = faster)
           * @type {number}
           */
          TimeScale: 1,
        };
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        /** @module Node */

        let Vec2 = require("vec2"),
          Defaults = require("./Defaults");

        /**
         * Single point (node) within a Path, whose only job is to manage it's position and movement towards new position.
         * @extends Vec2
         */
        class Node extends Vec2 {
          /**
           * Create a new Node object
           * @param {object} p5 Reference to global instance of p5.js for drawing
           * @param {number} x Initial X coordinate
           * @param {number} y Initial Y coordinate
           * @param {object} [settings] Object of local override Settings to merge with Defaults
           * @param {boolean} [isFixed] Whether or not this Node is allowed to move
           * @param {number} [minDistance] Minimum distance this Node wants to be to nearby Nodes
           * @param {number} [repulsionRadius] Radius around Node that will affect movement of other Nodes
           */
          constructor(p5, x, y, settings = Defaults, isFixed = false, minDistance, repulsionRadius) {
            super(x, y);

            this.p5 = p5;
            this.isFixed = isFixed;
            this.settings = Object.assign({}, Defaults, settings);

            this.velocity = 0;
            this.nextPosition = new Vec2(x, y);

            this.minDistance = minDistance || settings.MinDistance;
            this.repulsionRadius = repulsionRadius || settings.RepulsionRadius;
          }

          /** Moves Node by one "step */
          iterate() {
            if (!this.isFixed) {
              this.x = this.p5.lerp(this.x, this.nextPosition.x, this.settings.MaxVelocity);
              this.y = this.p5.lerp(this.y, this.nextPosition.y, this.settings.MaxVelocity);
            }
          }

          /** Draw this Node to the canvas */
          draw() {
            if (this.isFixed) {
              this.p5.ellipse(this.x, this.y, 20);
            } else {
              this.p5.ellipse(this.x, this.y, 5);
            }
          }
        }

        module.exports = Node;
      },
      { "./Defaults": 2, vec2: 21 },
    ],
    4: [
      function (require, module, exports) {
        /*
=============================================================================
  ParametersPanel class
=============================================================================
*/

        class ParametersPanel {
          constructor(world) {
            this.world = world;

            // Get all DOM elements
            this.getElements();

            // Set values of all ranges from World settings
            this.loadInitialValues();

            // Set up listeners to bind ranges/checkboxes to World parameters

            // Set up listeners to change value spans for each range
            this.setupValueChangeListeners();
          }

          getElements() {
            // Min distance
            this.minDistanceRange = document.querySelector(".parameters-content #min-distance");
            this.minDistanceValue = document.querySelector(".parameters-content #min-distance + .value");

            // Max distance
            this.maxDistanceRange = document.querySelector(".parameters-content #max-distance");
            this.maxDistanceValue = document.querySelector(".parameters-content #max-distance + .value");

            // Repulsion radius
            this.repulsionRadiusRange = document.querySelector(".parameters-content #repulsion-radius");
            this.repulsionRadiusValue = document.querySelector(".parameters-content #repulsion-radius + .value");

            // ---

            // Attraction force
            this.attractionForceRange = document.querySelector(".parameters-content #attraction-force");
            this.attractionForceValue = document.querySelector(".parameters-content #attraction-force + .value");

            // Repulsion force
            this.repulsionForceRange = document.querySelector(".parameters-content #repulsion-force");
            this.repulsionForceValue = document.querySelector(".parameters-content #repulsion-force + .value");

            // Alignment force
            this.alignmentForceRange = document.querySelector(".parameters-content #alignment-force");
            this.alignmentForceValue = document.querySelector(".parameters-content #alignment-force + .value");

            // ---

            // Checkboxes
            this.drawNodesCheckbox = document.querySelector(".parameters-content #draw-nodes");
            this.fillModeCheckbox = document.querySelector(".parameters-content #fill-mode");
            this.debugModeCheckbox = document.querySelector(".parameters-content #debug-mode");
            this.traceModeCheckbox = document.querySelector(".parameters-content #trace-mode");

            // ---

            // Draw history checkbox and ranges
            this.drawHistoryCheckbox = document.querySelector(".parameters-content #draw-history");

            this.historyIntervalRange = document.querySelector(".parameters-content #history-capture-interval");
            this.historyIntervalValue = document.querySelector(".parameters-content #history-capture-interval + .value");

            this.maxHistoryRange = document.querySelector(".parameters-content #max-history-size");
            this.maxHistoryValue = document.querySelector(".parameters-content #max-history-size + .value");

            // ---

            // Brownian motion checkbox and range
            this.brownianMotionCheckbox = document.querySelector(".parameters-content #use-brownian-motion");

            this.brownianMotionRange = document.querySelector(".parameters-content #brownian-motion-range");
            this.brownianMotionValue = document.querySelector(".parameters-content #brownian-motion-range + .value");

            // ---

            // Time scale range
            this.timeScaleRange = document.querySelector(".parameters-content #time-scale");
            this.timeScaleValue = document.querySelector(".parameters-content #time-scale + .value");
          }

          loadInitialValues() {
            // Min distance
            this.minDistanceRange.value = this.world.settings.MinDistance;
            this.minDistanceValue.innerHTML = this.world.settings.MinDistance;

            // Max distance
            this.maxDistanceRange.value = this.world.settings.MaxDistance;
            this.maxDistanceValue.innerHTML = this.world.settings.MaxDistance;

            // Repulsion radius
            this.repulsionRadiusRange.value = this.world.settings.RepulsionRadius;
            this.repulsionRadiusValue.innerHTML = this.world.settings.RepulsionRadius;

            // ---

            // Attraction force
            this.attractionForceRange.value = this.world.settings.AttractionForce;
            this.attractionForceValue.innerHTML = this.world.settings.AttractionForce;

            // Repulsion force
            this.repulsionForceRange.value = this.world.settings.RepulsionForce;
            this.repulsionForceValue.innerHTML = this.world.settings.RepulsionForce;

            // Alignment force
            this.alignmentForceRange.value = this.world.settings.AlignmentForce;
            this.alignmentForceValue.innerHTML = this.world.settings.AlignmentForce;

            // ---

            this.drawNodesCheckbox.checked = this.world.settings.DrawNodes;
            this.fillModeCheckbox.checked = this.world.settings.FillMode;
            this.debugModeCheckbox.checked = this.world.settings.DebugMode;
            this.traceModeCheckbox.checked = this.world.settings.TraceMode;

            // ---

            this.drawHistoryCheckbox.checked = this.world.settings.DrawHistory;

            this.historyIntervalRange.value = this.world.settings.HistoryCaptureInterval;
            this.historyIntervalValue.innerHTML = this.world.settings.HistoryCaptureInterval;

            this.maxHistoryRange.value = this.world.settings.MaxHistorySize;
            this.maxHistoryValue.innerHTML = this.world.settings.MaxHistorySize;

            // ---

            this.brownianMotionCheckbox.checked = this.world.settings.UseBrownianMotion;

            this.brownianMotionRange.value = this.world.settings.BrownianMotionRange;
            this.brownianMotionValue.innerHTML = this.world.settings.BrownianMotionRange;

            // ---

            this.timeScaleRange.value = this.world.settings.TimeScale;
            this.timeScaleValue.innerHTML = this.world.settings.TimeScale + "x";
          }

          setupValueChangeListeners() {
            this.minDistanceRange.addEventListener("input", this.minDistanceChangeHandler.bind(this));
            this.maxDistanceRange.addEventListener("input", this.maxDistanceChangeHandler.bind(this));
            this.repulsionRadiusRange.addEventListener("input", this.repulsionRadiusChangeHandler.bind(this));

            this.attractionForceRange.addEventListener("input", this.attractionForceChangeHandler.bind(this));
            this.repulsionForceRange.addEventListener("input", this.repulsionForceChangeHandler.bind(this));
            this.alignmentForceRange.addEventListener("input", this.alignmentForceChangeHandler.bind(this));

            this.drawNodesCheckbox.addEventListener("change", this.drawNodesChangeHandler.bind(this));
            this.fillModeCheckbox.addEventListener("change", this.fillModeChangeHandler.bind(this));
            this.debugModeCheckbox.addEventListener("change", this.debugModeChangeHandler.bind(this));
            this.traceModeCheckbox.addEventListener("change", this.traceModeChangeHandler.bind(this));

            this.drawHistoryCheckbox.addEventListener("change", this.drawHistoryChangeHandler.bind(this));
            this.historyIntervalRange.addEventListener("input", this.historyIntervalChangeHandler.bind(this));
            this.maxHistoryRange.addEventListener("input", this.maxHistoryChangeHandler.bind(this));

            this.brownianMotionCheckbox.addEventListener("change", this.brownianMotionChangeHandler.bind(this));
            this.brownianMotionRange.addEventListener("input", this.brownianMotionRangeChangeHandler.bind(this));

            this.timeScaleRange.addEventListener("input", this.timeScaleChangeHandler.bind(this));
          }

          minDistanceChangeHandler(e) {
            this.minDistanceValue.innerHTML = e.target.value;
            this.world.setMinDistance(e.target.value);
          }
          maxDistanceChangeHandler(e) {
            this.maxDistanceValue.innerHTML = e.target.value;
            this.world.setMaxDistance(e.target.value);
          }
          repulsionRadiusChangeHandler(e) {
            this.repulsionRadiusValue.innerHTML = e.target.value;
            this.world.setRepulsionRadius(e.target.value);
          }

          attractionForceChangeHandler(e) {
            this.attractionForceValue.innerHTML = e.target.value;
            this.world.setAttractionForce(e.target.value);
          }
          repulsionForceChangeHandler(e) {
            this.repulsionForceValue.innerHTML = e.target.value;
            this.world.setRepulsionForce(e.target.value);
          }
          alignmentForceChangeHandler(e) {
            this.alignmentForceValue.innerHTML = e.target.value;
            this.world.setAlignmentForce(e.target.value);
          }

          drawNodesChangeHandler(e) {
            this.world.setDrawNodes(e.target.checked);
          }
          fillModeChangeHandler(e) {
            this.world.setFillMode(e.target.checked);
          }
          debugModeChangeHandler(e) {
            this.world.setDebugMode(e.target.checked);
          }
          traceModeChangeHandler(e) {
            this.world.setTraceMode(e.target.checked);
          }

          drawHistoryChangeHandler(e) {
            this.world.setDrawHistory(e.target.checked);
          }
          historyIntervalChangeHandler(e) {
            this.historyIntervalValue.innerHTML = e.target.value;
            this.world.setHistoryCaptureInterval(parseFloat(e.target.value));
          }
          maxHistoryChangeHandler(e) {
            this.maxHistoryValue.innerHTML = e.target.value;
            this.world.setMaxHistorySize(parseInt(e.target.value));
          }

          brownianMotionChangeHandler(e) {
            this.world.setBrownianMotion(e.target.checked);
          }
          brownianMotionRangeChangeHandler(e) {
            this.brownianMotionValue.innerHTML = e.target.value;
          }

          timeScaleChangeHandler(e) {
            const value = parseFloat(e.target.value);
            this.timeScaleValue.innerHTML = value + "x";
            this.world.setTimeScale(value);

            // Update speed indicator on screen
            const speedIndicatorValue = document.querySelector(".speed-indicator .speed-value");
            const speedIndicatorContainer = document.querySelector(".speed-indicator");
            if (speedIndicatorValue) {
              speedIndicatorValue.innerHTML = value + "x";
            }
            // Show/hide based on whether it's 1x
            if (speedIndicatorContainer) {
              if (value === 1) {
                speedIndicatorContainer.classList.add("hidden");
              } else {
                speedIndicatorContainer.classList.remove("hidden");
              }
            }
          }
        }

        module.exports = ParametersPanel;
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        /** @module Path */

        let knn = require("rbush-knn"),
          Node = require("./Node"),
          Bounds = require("./Bounds"),
          Defaults = require("./Defaults");

        /** Manages a set of Nodes in a continuous, ordered data structure (an Array). */
        class Path {
          /**
           * Create a new Path object
           * @param {object} p5 Reference to global p5.js instance
           * @param {array} nodes Array of initial Node objects to start with
           * @param {object} [settings] Object containing local override Settings to be merged with Defaults
           * @param {boolean} [isClosed] Whether this Path is closed (true) or open (false)
           * @param {object} [bounds] Bounds object that this Path must stay within
           * @param {object} [fillColor] Fill color object containing properties h, s, b, and a
           * @param {object} [strokeColor] Stroke color object containing properties h, s, b, and a
           * @param {object} [invertedFillColor] Fill color in "invert mode" containing properties h, s, b, and a
           * @param {object} [invertedStrokeColor] Stroke color in "invert mode" containing properties h, s, b, and a
           */
          constructor(
            p5,
            nodes,
            settings = Defaults,
            isClosed = false,
            bounds = false,
            fillColor = { h: 0, s: 0, b: 0, a: 255 },
            strokeColor = { h: 0, s: 0, b: 0, a: 255 },
            invertedFillColor = { h: 0, s: 0, b: 255, a: 255 },
            invertedStrokeColor = { h: 0, s: 0, b: 255, a: 255 }
          ) {
            this.p5 = p5;
            this.nodes = nodes;
            this.isClosed = isClosed;
            this.settings = Object.assign({}, Defaults, settings);
            this.bounds = bounds;

            this.injectionMode = "RANDOM";
            this.lastNodeInjectTime = 0;

            this.nodeHistory = [];

            this.drawNodes = this.settings.DrawNodes;
            this.traceMode = this.settings.TraceMode;
            this.debugMode = this.settings.DebugMode;
            this.fillMode = this.settings.FillMode;
            this.useBrownianMotion = this.settings.UseBrownianMotion;
            this.drawHistory = this.settings.DrawHistory;
            this.showBounds = this.settings.ShowBounds;

            this.fillColor = fillColor;
            this.strokeColor = strokeColor;
            this.invertedFillColor = invertedFillColor;
            this.invertedStrokeColor = invertedStrokeColor;
          }

          /**
           * Run one "tick" of the simulation
           * @param {object} tree Reference to the appropriate R-tree index that this Path belongs to (see World)
           */
          iterate(tree) {
            for (let [index, node] of this.nodes.entries()) {
              // Apply Brownian motion to realistically 'jiggle' nodes
              if (this.useBrownianMotion) {
                this.applyBrownianMotion(index);
              }

              // Move towards neighbors (attraction), if there is space to move
              this.applyAttraction(index);

              // Move away from any nodes that are too close (repulsion)
              this.applyRepulsion(index, tree);

              // Align with neighbors
              this.applyAlignment(index);

              // Apply boundaries
              this.applyBounds(index);

              // Move towards next position
              node.iterate();
            }

            // Split any edges that have become too long
            this.splitEdges();

            // Remove any nodes that are too close to other nodes
            this.pruneNodes();

            // Inject a new node to introduce asymmetry every so often
            if (this.p5.millis() - this.lastNodeInjectTime >= this.settings.NodeInjectionInterval) {
              this.injectNode();
              this.lastNodeInjectTime = this.p5.millis();
            }
          }

          /**
           * For the Node wit the provided index, simulate the small random motions that real microscopic particles experience from collisions with fast-moving molecules
           * @param {number} index Index of Node to apply forces to
           */
          applyBrownianMotion(index) {
            this.nodes[index].x += this.p5.random(-this.settings.BrownianMotionRange / 2, this.settings.BrownianMotionRange / 2);
            this.nodes[index].y += this.p5.random(-this.settings.BrownianMotionRange / 2, this.settings.BrownianMotionRange / 2);
          }

          /**
           * Move the Node with the provided index closer to it's connected neighbor Nodes
           * @param {number} index Index of Node to apply forces to
           */
          applyAttraction(index) {
            let distance, leastMinDistance;
            let connectedNodes = this.getConnectedNodes(index);

            // Move towards next node, if there is one
            if (connectedNodes.nextNode != undefined && connectedNodes.nextNode instanceof Node && !this.nodes[index].isFixed) {
              distance = this.nodes[index].distance(connectedNodes.nextNode);
              leastMinDistance = Math.min(this.nodes[index].minDistance, connectedNodes.nextNode.minDistance);

              if (distance > leastMinDistance) {
                this.nodes[index].nextPosition.x = this.p5.lerp(
                  this.nodes[index].nextPosition.x,
                  connectedNodes.nextNode.x,
                  this.settings.AttractionForce
                );
                this.nodes[index].nextPosition.y = this.p5.lerp(
                  this.nodes[index].nextPosition.y,
                  connectedNodes.nextNode.y,
                  this.settings.AttractionForce
                );
              }
            }

            // Move towards previous node, if there is one
            if (connectedNodes.previousNode != undefined && connectedNodes.previousNode instanceof Node && !this.nodes[index].isFixed) {
              distance = this.nodes[index].distance(connectedNodes.previousNode);
              leastMinDistance = Math.min(this.nodes[index].minDistance, connectedNodes.previousNode.minDistance);

              if (distance > leastMinDistance) {
                this.nodes[index].nextPosition.x = this.p5.lerp(
                  this.nodes[index].nextPosition.x,
                  connectedNodes.previousNode.x,
                  this.settings.AttractionForce
                );
                this.nodes[index].nextPosition.y = this.p5.lerp(
                  this.nodes[index].nextPosition.y,
                  connectedNodes.previousNode.y,
                  this.settings.AttractionForce
                );
              }
            }
          }

          /**
           * Move the referenced Node (by index) away from all other nearby Nodes within the appropriate R-tree index (tree), within a pre-defined radius
           * @param {number} index Index of Node to apply forces to
           * @param {object} tree Reference to the appropriate R-tree index that this Path belongs to (see World)
           */
          applyRepulsion(index, tree) {
            // Perform knn search to find all neighbors within certain radius
            var neighbors = knn(
              tree,
              this.nodes[index].x,
              this.nodes[index].y,
              undefined,
              undefined,
              this.nodes[index].repulsionRadius * this.nodes[index].repulsionRadius
            ); // radius must be squared as per https://github.com/mourner/rbush-knn/issues/13

            // Move this node away from all nearby neighbors
            // TODO: Make this proportional to distance?
            for (let node of neighbors) {
              this.nodes[index].nextPosition.x = this.p5.lerp(this.nodes[index].x, node.x, -this.settings.RepulsionForce);
              this.nodes[index].nextPosition.y = this.p5.lerp(this.nodes[index].y, node.y, -this.settings.RepulsionForce);
            }
          }

          /**
           * Move the referenced Node (by index) towards the midpoint of it's connected neighbor Nodes in an effort to minimize curvature
           * @param {number} index Index of Node to apply forces to
           */
          applyAlignment(index) {
            let connectedNodes = this.getConnectedNodes(index);

            if (
              connectedNodes.previousNode != undefined &&
              connectedNodes.previousNode instanceof Node &&
              connectedNodes.nextNode != undefined &&
              connectedNodes.nextNode instanceof Node &&
              !this.nodes[index].isFixed
            ) {
              // Find the midpoint between the neighbors of this node
              let midpoint = this.getMidpointNode(connectedNodes.previousNode, connectedNodes.nextNode);

              // Move this point towards this midpoint
              this.nodes[index].nextPosition.x = this.p5.lerp(this.nodes[index].nextPosition.x, midpoint.x, this.settings.AlignmentForce);
              this.nodes[index].nextPosition.y = this.p5.lerp(this.nodes[index].nextPosition.y, midpoint.y, this.settings.AlignmentForce);
            }
          }

          /** Search for edges that are too long and inject a new Node to split them up */
          splitEdges() {
            for (let [index, node] of this.nodes.entries()) {
              let connectedNodes = this.getConnectedNodes(index);

              if (
                connectedNodes.previousNode != undefined &&
                connectedNodes.previousNode instanceof Node &&
                node.distance(connectedNodes.previousNode) >= this.settings.MaxDistance
              ) {
                let midpointNode = this.getMidpointNode(node, connectedNodes.previousNode);

                // Inject the new midpoint node into the global list
                if (index == 0) {
                  this.nodes.splice(this.nodes.length, 0, midpointNode);
                } else {
                  this.nodes.splice(index, 0, midpointNode);
                }
              }
            }
          }

          /** Remove Nodes that are too close to their neighbors to minimize "pinching" */
          pruneNodes() {
            for (let [index, node] of this.nodes.entries()) {
              let connectedNodes = this.getConnectedNodes(index);

              if (
                connectedNodes.previousNode != undefined &&
                connectedNodes.previousNode instanceof Node &&
                node.distance(connectedNodes.previousNode) < this.settings.MinDistance
              ) {
                if (index == 0) {
                  if (!this.nodes[this.nodes.length - 1].isFixed) {
                    this.nodes.splice(this.nodes.length - 1, 1);
                  }
                } else {
                  if (!this.nodes[index - 1].isFixed) {
                    this.nodes.splice(index - 1, 1);
                  }
                }
              }
            }
          }

          /** Insert a new Node using the current injection method */
          injectNode() {
            switch (this.injectionMode) {
              case "RANDOM":
                this.injectRandomNode();
                break;
              case "CURVATURE":
                this.injectNodeByCurvature();
                break;
            }
          }

          /** Insert a new Node in a random location along the Path, if there is space for it */
          injectRandomNode() {
            // Choose two connected nodes at random
            let index = parseInt(this.p5.random(1, this.nodes.length));
            let connectedNodes = this.getConnectedNodes(index);

            if (
              connectedNodes.previousNode != undefined &&
              connectedNodes.previousNode instanceof Node &&
              connectedNodes.nextNode != undefined &&
              connectedNodes.nextNode instanceof Node &&
              this.nodes[index].distance(connectedNodes.previousNode) > this.settings.MinDistance
            ) {
              // Create a new node in the middle
              let midpointNode = this.getMidpointNode(this.nodes[index], connectedNodes.previousNode);

              // Splice new node into array
              this.nodes.splice(index, 0, midpointNode);
            }
          }

          /** Insert a new Node in an area where curvature is high */
          injectNodeByCurvature() {
            for (let [index, node] of this.nodes.entries()) {
              let connectedNodes = this.getConnectedNodes(index);

              if (connectedNodes.previousNode == undefined || connectedNodes.nextNode == undefined) {
                continue;
              }

              // Find angle between adjacent nodes
              let n = connectedNodes.nextNode.y - connectedNodes.previousNode.y;
              let d = connectedNodes.nextNode.x - connectedNodes.previousNode.x;
              let angle = Math.round(Math.abs(Math.atan(n / d)));

              // // If angle is below a certain angle (high curvature), replace the current node with two nodes
              if (angle > 20) {
                let previousMidpointNode = this.getMidpointNode(node, connectedNodes.previousNode);
                let nextMidpointNode = this.getMidpointNode(node, connectedNodes.nextNode);

                // // Replace this node with the two new nodes
                if (index == 0) {
                  this.nodes.splice(this.nodes.length - 1, 0, previousMidpointNode);
                  this.nodes.splice(0, 0, nextMidpointNode);
                } else {
                  this.nodes.splice(index, 1, previousMidpointNode, nextMidpointNode);
                }
              }
            }
          }

          /**
           * Do not allow the referenced Node (by index) to leave the interior of the assigned Bounds polygon
           * @param {number} index Index of Node to apply force to
           */
          applyBounds(index) {
            if (this.bounds != undefined && this.bounds instanceof Bounds && !this.bounds.contains([this.nodes[index].x, this.nodes[index].y])) {
              this.nodes[index].isFixed = true;
            }
          }

          /**
           * For a given Node, find a return it's immediate connected neighbor Nodes
           * @param {number} index Index of Node to retrieve neighbors of
           * @returns {object} References to previous and next nodes, if they exist. Will always return a value for at least one.
           */
          getConnectedNodes(index) {
            let previousNode, nextNode;

            // Find previous node, if there is one
            if (index == 0 && this.isClosed) {
              previousNode = this.nodes[this.nodes.length - 1];
            } else if (index >= 1) {
              previousNode = this.nodes[index - 1];
            }

            // Find next node, if there is one
            if (index == this.nodes.length - 1 && this.isClosed) {
              nextNode = this.nodes[0];
            } else if (index <= this.nodes.length - 1) {
              nextNode = this.nodes[index + 1];
            }

            return {
              previousNode,
              nextNode,
            };
          }

          /**
           * Get a node at a specific offset from the given index along the path
           * @param {number} index Starting index
           * @param {number} offset Offset from index (positive or negative)
           * @returns {object|undefined} Node at the offset position, or undefined if not exists
           */
          getNodeAtDistance(index, offset) {
            if (offset === 0) return this.nodes[index];

            let targetIndex = index + offset;

            if (this.isClosed) {
              // Wrap around for closed paths
              targetIndex = ((targetIndex % this.nodes.length) + this.nodes.length) % this.nodes.length;
              return this.nodes[targetIndex];
            } else {
              // Check bounds for open paths
              if (targetIndex >= 0 && targetIndex < this.nodes.length) {
                return this.nodes[targetIndex];
              }
              return undefined;
            }
          }

          /**
           * Calculate the path distance between two nodes (n = number of nodes along the path, not pixels)
           * @param {number} fromIndex Starting node index
           * @param {number} toIndex Target node index
           * @returns {number} Minimum path distance in nodes (n) between nodes along the path
           */
          getPathDistance(fromIndex, toIndex) {
            if (fromIndex === toIndex) return 0;

            const directDistance = Math.abs(toIndex - fromIndex);

            if (this.isClosed) {
              // For closed paths, consider wrap-around distance
              const wrapDistance = this.nodes.length - directDistance;
              return Math.min(directDistance, wrapDistance);
            } else {
              return directDistance;
            }
          }

          /**
           * Create and return a Node exactly halfway between the two provided Nodes
           * @param {object} node1 First node
           * @param {object} node2 Second node
           * @param {boolean} [fixed] Whether this new Node should be fixed or not
           * @returns {object} New Node object
           */
          getMidpointNode(node1, node2, fixed = false) {
            return new Node(this.p5, (node1.x + node2.x) / 2, (node1.y + node2.y) / 2, this.settings, fixed);
          }

          /** Draw this Path to the canvas using current object visibility settings */
          draw() {
            // Check if dark mode is active
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

            // Select appropriate colors based on dark mode
            const currentFillColor = isDarkMode ? this.invertedFillColor : this.fillColor;
            const currentStrokeColor = isDarkMode ? this.invertedStrokeColor : this.strokeColor;

            // Draw all the previous paths saved to the history array
            if (this.drawHistory) {
              this.drawPreviousEdges();
            }

            // Draw bounds
            if (this.showBounds && this.bounds != undefined && this.bounds instanceof Bounds) {
              this.drawBounds();
            }

            // Set shape fill
            if (this.fillMode && this.isClosed) {
              this.p5.fill(currentFillColor.h, currentFillColor.s, currentFillColor.b, currentFillColor.a);
            } else {
              this.p5.noFill();
            }

            // Set stroke color
            this.p5.stroke(currentStrokeColor.h, currentStrokeColor.s, currentStrokeColor.b, currentStrokeColor.a);

            // Draw current edges
            this.drawCurrentEdges();

            // Draw all nodes
            if (this.drawNodes) {
              this.drawCurrentNodes();
            }
          }

          /** Draw the current edges (leading edge) of the path */
          drawCurrentEdges() {
            this.drawEdges(this.nodes);
          }

          /** Draw all previous edges of the path saved to history array */
          drawPreviousEdges() {
            // Check if dark mode is active
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            const currentStrokeColor = isDarkMode ? this.invertedStrokeColor : this.strokeColor;

            for (let [index, nodes] of this.nodeHistory.entries()) {
              this.p5.stroke(currentStrokeColor.h, currentStrokeColor.s, currentStrokeColor.b, index * 30);

              this.drawEdges(nodes);
            }
          }

          /**
           * Draw edges for a given set of nodes - can be either the current or previous nodes
           * @param {array} nodes Array of Node objects
           */
          drawEdges(nodes) {
            // Begin capturing vertices
            if (!this.debugMode) {
              this.p5.beginShape();
            }

            // Create vertices or lines (if debug mode)
            for (let i = 0; i < nodes.length; i++) {
              if (!this.debugMode) {
                this.p5.vertex(nodes[i].x, nodes[i].y);
              } else {
                // In debug mode each line has a unique stroke color, which isn't possible with begin/endShape(). Instead we'll use line()
                if (i > 0) {
                  if (!this.traceMode) {
                    this.p5.stroke(this.p5.map(i, 0, nodes.length - 1, 0, 255, true), 255, 255, 255);
                  } else {
                    this.p5.stroke(this.p5.map(i, 0, nodes.length - 1, 0, 255, true), 255, 255, 2);
                  }

                  this.p5.line(nodes[i - 1].x, nodes[i - 1].y, nodes[i].x, nodes[i].y);
                }
              }
            }

            // For closed paths, connect the last and first nodes
            if (this.isClosed) {
              if (!this.debugMode) {
                this.p5.vertex(nodes[0].x, nodes[0].y);
              } else {
                this.p5.line(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y, nodes[0].x, nodes[0].y);
              }
            }

            // Stop capturing vertices
            if (!this.debugMode) {
              this.p5.endShape();
            }
          }

          /** Draw circles for every node */
          drawCurrentNodes() {
            this.p5.noStroke();

            // Check if dark mode is active
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

            if (!isDarkMode) {
              this.p5.fill(0);
            } else {
              this.p5.fill(255);
            }

            for (let [index, node] of this.nodes.entries()) {
              if (this.debugMode) {
                this.p5.fill(this.p5.map(index, 0, this.nodes.length - 1, 0, 255, true), 255, 255, 255);
              }

              node.draw();
            }
          }

          /** Draw boundary shape(s) */
          drawBounds() {
            // Check if dark mode is active
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

            if (!isDarkMode) {
              this.p5.stroke(200);
            } else {
              this.p5.stroke(100);
            }

            this.p5.noFill();

            this.bounds.draw();
          }

          /** Take a snapshot of the current nodes by saving a dereferenced clone of them to the history array */
          addToHistory() {
            if (this.nodeHistory.length == this.settings.MaxHistorySize) {
              this.nodeHistory.shift();
            }

            this.nodeHistory.push(Object.assign([], JSON.parse(JSON.stringify(this.nodes))));
          }

          /**
           * Move this entire Path by a certain amount by moving all of it's Nodes
           * @param {number} xOffset Distance on X axis to move Path
           * @param {number} yOffset Distance on Y axis to move Path
           */
          moveTo(xOffset, yOffset) {
            for (let node of this.nodes) {
              node.x += xOffset;
              node.y += yOffset;
            }
          }

          /**
           * Scale (multiply) all Nodes by the provided factor
           * @param {number} factor Factor to multiple all Nodes' coordinates by
           */
          scale(factor) {
            for (let node of this.nodes) {
              node.x *= factor;
              node.y *= factor;
            }
          }

          /**
           * Insert a new Node object from outside of this class
           * @param {object} node Node object to insert
           */
          addNode(node) {
            this.nodes.push(node);
          }

          /**
           * Return a raw 2D array of all Node coordinates. Useful for creating Bounds objects.
           * @returns {array} Array of all Node coordinates in the format of [polygon_n][x1][y1], ...
           */
          toArray() {
            let polygon = [];

            for (let node of this.nodes) {
              polygon.push([node.x, node.y]);
            }

            return polygon;
          }

          /**
           * Get the current state of "trace mode" flag
           * @returns {boolean} Current state of "trace mode" flag
           */
          getTraceMode() {
            return this.traceMode;
          }

          /**
           * Sets the minimum distance that each Node wants to be from it's neighboring Nodes
           * @param {number} minDistance
           */
          setMinDistance(minDistance) {
            this.settings.MinDistance = minDistance;

            for (let node of this.nodes) {
              node.minDistance = minDistance;
            }
          }

          /**
           * Sets the maximum distance an edge can be before it is split
           * @param {number} maxDistance
           */
          setMaxDistance(maxDistance) {
            this.settings.MaxDistance = maxDistance;

            for (let node of this.nodes) {
              node.maxDistance = maxDistance;
            }
          }

          /**
           * Sets the radius around each Node that it can affect other Nodes
           * @param {number} repulsionRadius
           */
          setRepulsionRadius(repulsionRadius) {
            this.settings.RepulsionRadius = repulsionRadius;

            for (let node of this.nodes) {
              node.repulsionRadius = repulsionRadius;
            }
          }

          /**
           * Sets the force scalar that is used when Nodes pull each other closer
           * @param {number} attractionForce
           */
          setAttractionForce(attractionForce) {
            this.settings.AttractionForce = attractionForce;
          }

          /**
           * Sets the force scalar that is used when Nodes are pushing others away
           * @param {number} repulsionForce
           */
          setRepulsionForce(repulsionForce) {
            this.settings.RepulsionForce = repulsionForce;
          }

          /**
           * Sets the force scalar that is used when Nodes trying to align with their neighbors to reduce curvature
           * @param {number} alignmentForce
           */
          setAlignmentForce(alignmentForce) {
            this.settings.AlignmentForce = alignmentForce;
          }

          /**
           * Sets the state of the "trace mode" flag
           * @param {boolean} state New state for "trace mode" flag
           */
          setTraceMode(state) {
            this.traceMode = state;
          }

          /**
           * Set the Bounds object that this Path must stay within
           * @param {object} bounds Bounds object that this Path must stay within
           */
          setBounds(bounds) {
            this.bounds = bounds;
          }

          /** Toggle the current state of the "trace mode" flag */
          toggleTraceMode() {
            this.setTraceMode(!this.getTraceMode());
          }
        }

        module.exports = Path;
      },
      { "./Bounds": 1, "./Defaults": 2, "./Node": 3, "rbush-knn": 13 },
    ],
    6: [
      function (require, module, exports) {
        /** @module SVGLoader */

        let Node = require("./Node"),
          Path = require("./Path"),
          Defaults = require("./Defaults"),
          { SVGPathData } = require("svg-pathdata");

        /** Utility class to load an external SVG file and produce Path(s) */
        class SVGLoader {
          constructor() {}

          /**
           * Kick of loading of an SVG document embedded within a DOM element with the provided ID
           * @param {object} p5 Reference to the global instance of p5.js
           * @param {string} id ID attribute of the DOM node to load SVG data from
           * @param {object} settings Object containing local override Settings to merge with Defaults
           * @returns {array} See `load()`
           */
          static loadFromObject(p5, id, settings = Defaults) {
            return this.load(p5, document.getElementById(id), settings);
          }

          /**
           * Extract path data from the provided SVG node and produce a set of Path objects with Nodes
           * @param {object} p5 Reference to the global instance of p5.js
           * @param {node} svgNode SVG DOM node to load data from
           * @param {object} settings Object containing local override Settings to merge with Defaults
           */
          static load(p5, svgNode, settings = Defaults) {
            this.settings = Object.assign({}, Defaults, settings);

            let inputPaths = svgNode.querySelectorAll("path"),
              currentPath = new Path(p5, [], this.settings, true),
              paths = [];

            // Scrape all points from all points, and record breakpoints
            for (let inputPath of inputPaths) {
              let pathData = new SVGPathData(inputPath.getAttribute("d"));

              let previousCoords = {
                x: 0,
                y: 0,
              };

              for (let [index, command] of pathData.commands.entries()) {
                switch (command.type) {
                  // Move ('M') and line ('L') commands have both X and Y
                  case SVGPathData.MOVE_TO:
                  case SVGPathData.LINE_TO:
                    currentPath.addNode(new Node(p5, command.x, command.y, this.settings));
                    break;

                  // Horizontal line ('H') commands only have X, using previous command's Y
                  case SVGPathData.HORIZ_LINE_TO:
                    currentPath.addNode(new Node(p5, command.x, previousCoords.y, this.settings));
                    break;

                  // Vertical line ('V') commands only have Y, using previous command's X
                  case SVGPathData.VERT_LINE_TO:
                    currentPath.addNode(new Node(p5, previousCoords.x, command.y, this.settings));
                    break;

                  // ClosePath ('Z') commands are a naive indication that the current path can be processed and added to the world
                  case SVGPathData.CLOSE_PATH:
                    // Capture path in return object
                    paths.push(currentPath);

                    // Set up a new empty Path for the next loop iterations
                    currentPath = new Path(p5, [], this.settings, true);
                    currentPath.setInvertedColors(true);
                    break;
                }

                // Unclosed paths never have CLOSE_PATH commands, so wrap up the current path when we're at the end of the path and have not found the command
                if (index == pathData.commands.length - 1 && command.type != SVGPathData.CLOSE_PATH) {
                  let firstNode = currentPath.nodes[0],
                    lastNode = currentPath.nodes[currentPath.nodes.length - 1];

                  // Automatically close the path if the first and last nodes are effectively the same, even if a CLOSE_PATH command doesn't exist
                  if (lastNode.distance(firstNode) < 0.1) {
                    currentPath.isClosed = true;
                  } else {
                    currentPath.isClosed = false;
                  }

                  paths.push(currentPath);

                  currentPath = new Path(p5, [], this.settings, true);
                }

                // Capture X coordinate, if there was one
                if (command.hasOwnProperty("x")) {
                  previousCoords.x = command.x;
                }

                // Capture Y coordinate, if there was one
                if (command.hasOwnProperty("y")) {
                  previousCoords.y = command.y;
                }
              }
            }

            return paths;
          }
        }

        module.exports = SVGLoader;
      },
      { "./Defaults": 2, "./Node": 3, "./Path": 5, "svg-pathdata": 15 },
    ],
    7: [
      function (require, module, exports) {
        module.exports = {
          MinDistance: 2,
          MaxDistance: 5,
          RepulsionRadius: 15,
          MaxVelocity: 0.1,
          AttractionForce: 0.2,
          RepulsionForce: 0.6,
          AlignmentForce: 0.55,
          NodeInjectionInterval: 100,
          DrawNodes: false,
          TraceMode: false,
          InvertedColors: false,
          DebugMode: false,
          FillMode: false,
          DrawHistory: false,
          ShowBounds: true,
          UseBrownianMotion: true,
          BrownianMotionRange: 0.01,
          TimeScale: 1,
        };
      },
      {},
    ],
    8: [
      function (require, module, exports) {
        /** @module World */

        let rbush = require("rbush"),
          toPath = require("svg-points").toPath,
          saveAs = require("file-saver").saveAs,
          Defaults = require("./Defaults");

        /** Manages a set of Paths and provides some global control mechanisms, such as pausing the simulation. */
        class World {
          /**
           * Create a new World object
           * @param {object} p5 Reference to global p5.js instance
           * @param {object} [settings] Object containing local override Settings to be merged with Defaults
           * @param {array} [paths] Array of Path objects that belong to this World
           */
          constructor(p5, settings = Defaults, paths = []) {
            this.p5 = p5;
            this.paths = paths;

            this.paused = false;
            this.settings = Object.assign({}, Defaults, settings);

            // Load time scale from localStorage if available
            const savedTimeScale = localStorage.getItem("differential-growth-timeScale");
            if (savedTimeScale !== null) {
              this.settings.TimeScale = parseFloat(savedTimeScale);
            }

            this.traceMode = this.settings.TraceMode;
            this.drawNodes = this.settings.DrawNodes;
            this.debugMode = this.settings.DebugMode;
            this.fillMode = this.settings.FillMode;
            this.drawHistory = this.settings.DrawHistory;
            this.useBrownianMotion = this.settings.UseBrownianMotion;
            this.showBounds = this.settings.ShowBounds;
            this.timeScale = this.settings.TimeScale;

            this.tree = rbush(9, [".x", ".y", ".x", ".y"]); // use custom accessor strings per https://github.com/mourner/rbush#data-format
            this.buildTree();

            // Begin capturing path history
            this.historyIntervalId = null;
            this.startHistoryCapture();
          }

          /** Start or restart history capture with current interval setting */
          startHistoryCapture() {
            // Clear existing interval if it exists
            if (this.historyIntervalId !== null) {
              clearInterval(this.historyIntervalId);
            }

            // Start new interval
            let _this = this;
            this.historyIntervalId = setInterval(function () {
              _this.addToHistory();
            }, this.settings.HistoryCaptureInterval);
          }

          /** Run a single "tick" of the simulation by iterating on all Paths */
          iterate() {
            this.prunePaths();
            this.buildTree();

            if (this.paths != undefined && this.paths instanceof Array && this.paths.length > 0 && !this.paused) {
              for (let path of this.paths) {
                path.iterate(this.tree);
              }
            }
          }

          /** Draw the background and all Paths */
          draw() {
            if (!this.traceMode) {
              this.drawBackground();
            }

            for (let path of this.paths) {
              path.draw();
            }
          }

          /** Draw the background to the canvas */
          drawBackground() {
            // Use transparent background to show webpage background
            this.p5.clear();
          }

          /** Build an R-tree spatial index with all Nodes of all Paths in this World */
          buildTree() {
            this.tree.clear();

            for (let path of this.paths) {
              this.tree.load(path.nodes);
            }
          }

          /**
           * Add a new Path to the World from outside this class
           * @param {object} path Path object to add to this World
           */
          addPath(path) {
            // Cascade all current World settings to new path
            path.drawNodes = this.drawNodes;
            path.debugMode = this.debugMode;
            path.fillMode = this.fillMode;
            path.useBrownianMotion = this.useBrownianMotion;
            path.setTraceMode(this.traceMode);

            this.paths.push(path);
          }

          /**
           * Add multiple Path objects to this World
           * @param {array} paths
           */
          addPaths(paths) {
            for (let path of paths) {
              this.addPath(path);
            }
          }

          /** Add another snapshot to each Path */
          addToHistory() {
            if (!this.paused) {
              for (let path of this.paths) {
                path.addToHistory();
              }
            }
          }

          /** Remove any Paths that have gotten too small */
          prunePaths() {
            for (let i = 0; i < this.paths.length; i++) {
              if (this.paths[i].nodes.length <= 1) {
                this.paths.splice(i, 1);
              }
            }
          }

          /** Generate an SVG file using the current canvas contents and open up a download prompt on the user's machine */
          export() {
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            svg.setAttribute("width", window.innerWidth);
            svg.setAttribute("height", window.innerHeight);
            svg.setAttribute("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight);

            // Add background rectangle based on current theme for SVG export
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            let bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            bgRect.setAttribute("width", window.innerWidth);
            bgRect.setAttribute("height", window.innerHeight);
            bgRect.setAttribute("fill", isDarkMode ? "#000000" : "#ffffff");
            svg.appendChild(bgRect);

            // Add a <path> node for every Path in this World
            for (let path of this.paths) {
              // If history is enabled, create a new <path> node for each snapshot
              if (this.drawHistory) {
                for (let nodes of path.nodeHistory) {
                  svg.appendChild(this.createPathElFromNodes(nodes, path.isClosed));
                }
              }

              svg.appendChild(this.createPathElFromNodes(path.nodes), path.isClosed);
            }

            // Force download of SVG based on https://jsfiddle.net/ch77e7yh/1
            const svgDoctype = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>';
            const serializedSvg = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgDoctype, serializedSvg], { type: "image/svg+xml;" });
            saveAs(blob, "differential-growth-" + Date.now() + ".svg");
          }

          /**
           * Create a new SVG path element from a provided set of Node objects
           * @param {array} nodes Array of Node objects
           * @param {boolean} isClosed Whether this path should be closed (true) or open (false)
           * @returns SVG path DOM node with a `d` attribute generated from the provided Nodes array.
           */
          createPathElFromNodes(nodes, isClosed) {
            let pointsString = "";

            for (let [index, node] of nodes.entries()) {
              pointsString += node.x + "," + node.y;

              if (index < nodes.length - 1) {
                pointsString += " ";
              }
            }

            let d = toPath({
              type: "polyline",
              points: pointsString,
            });

            if (isClosed) {
              d += " Z";
            }

            // Use current theme for stroke color in SVG export
            const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
            const strokeColor = isDarkMode ? "white" : "black";

            let pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
            pathEl.setAttribute("d", d);
            pathEl.setAttribute("style", `fill: none; stroke: ${strokeColor}; stroke-width: 1`);

            return pathEl;
          }

          /** Remove all Paths from this World */
          clearPaths() {
            this.paths = [];
          }

          /** Pause the simulation */
          pause() {
            this.paused = true;
          }

          /** Unpause the simulation */
          unpause() {
            this.paused = false;
          }

          /**
           * Get the current state of the Nodes visibility flag
           * @returns {boolean} Current state of Node visibility flag
           */
          getDrawNodes() {
            return this.drawNodes;
          }

          /**
           * Get the current state of the debug mode flag
           * @returns {boolean} Current state of debug mode flag
           */
          getDebugMode() {
            return this.debugMode;
          }

          /**
           * Get the current state of the fill mode flag
           * @returns {boolean} Current state of the fill mode flag
           */
          getFillMode() {
            return this.fillMode;
          }

          /**
           * Get the current state of the history effect visibility flag
           * @returns {boolean} Current state of the history effect visibility flag
           */
          getDrawHistory() {
            return this.drawHistory;
          }

          /**
           * Get the current state of the Bounds visibility flag
           * @returns {boolean} Current state of the Bounds visibility flag
           */
          getDrawBounds() {
            return this.showBounds;
          }

          /**
           * Set the minimum distance that each Node wants to be from it's connected neighbors
           * @param {number} minDistance Distance that each Node wants to be from it's neighbors
           */
          setMinDistance(minDistance) {
            this.settings.MinDistance = minDistance;

            for (let path of this.paths) {
              path.setMinDistance(minDistance);
            }
          }

          /**
           * Set the maximum distance an edge can be before it is split
           * @param {number} maxDistance Distance between each Node
           */
          setMaxDistance(maxDistance) {
            this.settings.MaxDistance = maxDistance;

            for (let path of this.paths) {
              path.setMaxDistance(maxDistance);
            }
          }

          /**
           * Set the distance around each Node that it can affect other Nodes through repulsion
           * @param {number} repulsionRadius Distance around each Node
           */
          setRepulsionRadius(repulsionRadius) {
            this.settings.RepulsionRadius = repulsionRadius;

            for (let path of this.paths) {
              path.setRepulsionRadius(repulsionRadius);
            }
          }

          /**
           * Set the force scalar that is used when Nodes pull each other closer
           * @param {number} attractionForce Scalar value used for attraction force
           */
          setAttractionForce(attractionForce) {
            this.settings.AttractionForce = attractionForce;

            for (let path of this.paths) {
              path.setAttractionForce(attractionForce);
            }
          }

          /**
           * Set the force scalar that is used when Nodes are pushing others away
           * @param {number} repulsionForce Scalar value used for repulsion force
           */
          setRepulsionForce(repulsionForce) {
            this.settings.RepulsionForce = repulsionForce;

            for (let path of this.paths) {
              path.setRepulsionForce(repulsionForce);
            }
          }

          /**
           * Set the force scalar that is used when Nodes trying to align with their neighbors to reduce curvature
           * @param {number} alignmentForce Scalar value used for alignment force
           */
          setAlignmentForce(alignmentForce) {
            this.settings.AlignmentForce = alignmentForce;

            for (let path of this.paths) {
              path.setAlignmentForce(alignmentForce);
            }
          }

          /**
           * Set the state of the Node visibility flag
           * @param {boolean} state Next state for the Node visibility flag
           */
          setDrawNodes(state) {
            this.drawBackground();

            for (let path of this.paths) {
              path.drawNodes = state;
              path.draw();
            }

            this.drawNodes = state;
            this.settings.DrawNodes = state;
          }

          /**
           * Set the state of the "debug mode" flag
           * @param {boolean} state Next state for the "debug mode" flag
           */
          setDebugMode(state) {
            this.drawBackground();

            for (let path of this.paths) {
              path.debugMode = state;
              path.draw();
            }

            this.debugMode = state;
            this.settings.DebugMode = state;
          }

          /**
           * Set the state of the "fill mode" flag
           * @param {boolean} state Next state for the "fill mode" flag
           */
          setFillMode(state) {
            this.drawBackground();

            for (let path of this.paths) {
              path.fillMode = state;
              path.draw();
            }

            this.fillMode = state;
            this.settings.FillMode = state;
          }

          /**
           * Set the state of the "history" effect flag
           * @param {boolean} state Next state for the "history" effect flag
           */
          setDrawHistory(state) {
            this.drawBackground();

            for (let path of this.paths) {
              path.drawHistory = state;
              path.draw();
            }

            this.drawHistory = state;
            this.settings.DrawHistory = state;
          }

          /**
           * Set the state of the "trace mode" flag
           * @param {boolean} state Next state for the "trace mode" flag
           */
          setTraceMode(state) {
            this.traceMode = state;
            this.settings.TraceMode = state;
            this.drawBackground();

            for (let path of this.paths) {
              path.traceMode = state;
            }
          }

          /**
           * Set the state of the Bounds visibility flag
           * @param {boolean} state Next state for the Bounds visibility flag
           */
          setDrawBounds(state) {
            this.drawBackground();

            for (let path of this.paths) {
              path.showBounds = state;
              path.draw();
            }

            this.showBounds = state;
          }

          /**
           * Set the state of Brownian motion
           * @param {boolean} state Next state for Brownian motion
           */
          setBrownianMotion(state) {
            this.useBrownianMotion = state;
            this.settings.UseBrownianMotion = state;

            for (let path of this.paths) {
              path.useBrownianMotion = state;
            }
          }

          /**
           * Set the history capture interval
           * @param {number} interval Interval in milliseconds
           */
          setHistoryCaptureInterval(interval) {
            this.settings.HistoryCaptureInterval = interval;
            this.startHistoryCapture();
          }

          /**
           * Set the maximum history size
           * @param {number} size Maximum number of history snapshots to keep
           */
          setMaxHistorySize(size) {
            this.settings.MaxHistorySize = size;

            for (let path of this.paths) {
              path.settings.MaxHistorySize = size;
            }
          }

          /**
           * Set the time scale for simulation speed
           * @param {number} scale Speed multiplier (1 = normal, higher = faster)
           */
          setTimeScale(scale) {
            this.timeScale = scale;
            this.settings.TimeScale = scale;

            // Save to localStorage
            localStorage.setItem("differential-growth-timeScale", scale.toString());
          }

          /**
           * Get the current time scale
           * @returns {number} Current time scale value
           */
          getTimeScale() {
            return this.timeScale;
          }

          /** Toggle the state of the Node visibility flag */
          toggleDrawNodes() {
            this.setDrawNodes(!this.getDrawNodes());
          }

          /** Toggle the state of the "trace mode" effect flag */
          toggleTraceMode() {
            this.traceMode = !this.traceMode;
            this.drawBackground();

            for (let path of this.paths) {
              path.toggleTraceMode();
              path.draw();
            }
          }

          /** Toggle the state of the "debug mode" flag */
          toggleDebugMode() {
            this.setDebugMode(!this.getDebugMode());
          }

          /** Toggle the state of the "fill mode" flag */
          toggleFillMode() {
            this.setFillMode(!this.getFillMode());
          }

          /** Toggle the state of the "history" effect flag */
          toggleDrawHistory() {
            this.setDrawHistory(!this.getDrawHistory());
          }

          /** Toggle the state of the Bounds visibility flag */
          toggleDrawBounds() {
            this.setDrawBounds(!this.getDrawBounds());
          }

          /** Toggle the pause/unpause state of the simulation */
          togglePause() {
            if (this.paused) {
              this.unpause();
            } else {
              this.pause();
            }
          }
        }

        module.exports = World;
      },
      { "./Defaults": 2, "file-saver": 10, rbush: 14, "svg-points": 16 },
    ],
    9: [
      function (require, module, exports) {
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
      },
      { "./Node": 3, "./ParametersPanel": 4, "./Path": 5, "./SVGLoader": 6, "./Settings": 7, "./World": 8 },
    ],
    10: [
      function (require, module, exports) {
        (function (global) {
          (function () {
            (function (a, b) {
              if ("function" == typeof define && define.amd) define([], b);
              else if ("undefined" != typeof exports) b();
              else {
                b(), (a.FileSaver = { exports: {} }.exports);
              }
            })(this, function () {
              "use strict";
              function b(a, b) {
                return (
                  "undefined" == typeof b
                    ? (b = { autoBom: !1 })
                    : "object" != typeof b && (console.warn("Deprecated: Expected third argument to be a object"), (b = { autoBom: !b })),
                  b.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)
                    ? new Blob(["\uFEFF", a], { type: a.type })
                    : a
                );
              }
              function c(a, b, c) {
                var d = new XMLHttpRequest();
                d.open("GET", a),
                  (d.responseType = "blob"),
                  (d.onload = function () {
                    g(d.response, b, c);
                  }),
                  (d.onerror = function () {
                    console.error("could not download file");
                  }),
                  d.send();
              }
              function d(a) {
                var b = new XMLHttpRequest();
                b.open("HEAD", a, !1);
                try {
                  b.send();
                } catch (a) {}
                return 200 <= b.status && 299 >= b.status;
              }
              function e(a) {
                try {
                  a.dispatchEvent(new MouseEvent("click"));
                } catch (c) {
                  var b = document.createEvent("MouseEvents");
                  b.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), a.dispatchEvent(b);
                }
              }
              var f =
                  "object" == typeof window && window.window === window
                    ? window
                    : "object" == typeof self && self.self === self
                      ? self
                      : "object" == typeof global && global.global === global
                        ? global
                        : void 0,
                a =
                  f.navigator &&
                  /Macintosh/.test(navigator.userAgent) &&
                  /AppleWebKit/.test(navigator.userAgent) &&
                  !/Safari/.test(navigator.userAgent),
                g =
                  f.saveAs ||
                  ("object" != typeof window || window !== f
                    ? function () {}
                    : "download" in HTMLAnchorElement.prototype && !a
                      ? function (b, g, h) {
                          var i = f.URL || f.webkitURL,
                            j = document.createElement("a");
                          (g = g || b.name || "download"),
                            (j.download = g),
                            (j.rel = "noopener"),
                            "string" == typeof b
                              ? ((j.href = b), j.origin === location.origin ? e(j) : d(j.href) ? c(b, g, h) : e(j, (j.target = "_blank")))
                              : ((j.href = i.createObjectURL(b)),
                                setTimeout(function () {
                                  i.revokeObjectURL(j.href);
                                }, 4e4),
                                setTimeout(function () {
                                  e(j);
                                }, 0));
                        }
                      : "msSaveOrOpenBlob" in navigator
                        ? function (f, g, h) {
                            if (((g = g || f.name || "download"), "string" != typeof f)) navigator.msSaveOrOpenBlob(b(f, h), g);
                            else if (d(f)) c(f, g, h);
                            else {
                              var i = document.createElement("a");
                              (i.href = f),
                                (i.target = "_blank"),
                                setTimeout(function () {
                                  e(i);
                                });
                            }
                          }
                        : function (b, d, e, g) {
                            if (
                              ((g = g || open("", "_blank")),
                              g && (g.document.title = g.document.body.innerText = "downloading..."),
                              "string" == typeof b)
                            )
                              return c(b, d, e);
                            var h = "application/octet-stream" === b.type,
                              i = /constructor/i.test(f.HTMLElement) || f.safari,
                              j = /CriOS\/[\d]+/.test(navigator.userAgent);
                            if ((j || (h && i) || a) && "undefined" != typeof FileReader) {
                              var k = new FileReader();
                              (k.onloadend = function () {
                                var a = k.result;
                                (a = j ? a : a.replace(/^data:[^;]*;/, "data:attachment/file;")),
                                  g ? (g.location.href = a) : (location = a),
                                  (g = null);
                              }),
                                k.readAsDataURL(b);
                            } else {
                              var l = f.URL || f.webkitURL,
                                m = l.createObjectURL(b);
                              g ? (g.location = m) : (location.href = m),
                                (g = null),
                                setTimeout(function () {
                                  l.revokeObjectURL(m);
                                }, 4e4);
                            }
                          });
              (f.saveAs = g.saveAs = g), "undefined" != typeof module && (module.exports = g);
            });
          }).call(this);
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      },
      {},
    ],
    11: [
      function (require, module, exports) {
        module.exports = function (point, vs) {
          // ray-casting algorithm based on
          // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

          var x = point[0],
            y = point[1];

          var inside = false;
          for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0],
              yi = vs[i][1];
            var xj = vs[j][0],
              yj = vs[j][1];

            var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
          }

          return inside;
        };
      },
      {},
    ],
    12: [
      function (require, module, exports) {
        (function (global, factory) {
          typeof exports === "object" && typeof module !== "undefined"
            ? (module.exports = factory())
            : typeof define === "function" && define.amd
              ? define(factory)
              : (global.quickselect = factory());
        })(this, function () {
          "use strict";

          function quickselect(arr, k, left, right, compare) {
            quickselectStep(arr, k, left || 0, right || arr.length - 1, compare || defaultCompare);
          }

          function quickselectStep(arr, k, left, right, compare) {
            while (right > left) {
              if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp((2 * z) / 3);
                var sd = 0.5 * Math.sqrt((z * s * (n - s)) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - (m * s) / n + sd));
                var newRight = Math.min(right, Math.floor(k + ((n - m) * s) / n + sd));
                quickselectStep(arr, k, newLeft, newRight, compare);
              }

              var t = arr[k];
              var i = left;
              var j = right;

              swap(arr, left, k);
              if (compare(arr[right], t) > 0) swap(arr, left, right);

              while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
              }

              if (compare(arr[left], t) === 0) swap(arr, left, j);
              else {
                j++;
                swap(arr, j, right);
              }

              if (j <= k) left = j + 1;
              if (k <= j) right = j - 1;
            }
          }

          function swap(arr, i, j) {
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
          }

          function defaultCompare(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
          }

          return quickselect;
        });
      },
      {},
    ],
    13: [
      function (require, module, exports) {
        "use strict";

        var Queue = require("tinyqueue");

        module.exports = knn;
        module.exports.default = knn;

        function knn(tree, x, y, n, predicate, maxDistance) {
          var node = tree.data,
            result = [],
            toBBox = tree.toBBox,
            i,
            child,
            dist,
            candidate;

          var queue = new Queue(null, compareDist);

          while (node) {
            for (i = 0; i < node.children.length; i++) {
              child = node.children[i];
              dist = boxDist(x, y, node.leaf ? toBBox(child) : child);
              if (!maxDistance || dist <= maxDistance) {
                queue.push({
                  node: child,
                  isItem: node.leaf,
                  dist: dist,
                });
              }
            }

            while (queue.length && queue.peek().isItem) {
              candidate = queue.pop().node;
              if (!predicate || predicate(candidate)) result.push(candidate);
              if (n && result.length === n) return result;
            }

            node = queue.pop();
            if (node) node = node.node;
          }

          return result;
        }

        function compareDist(a, b) {
          return a.dist - b.dist;
        }

        function boxDist(x, y, box) {
          var dx = axisDist(x, box.minX, box.maxX),
            dy = axisDist(y, box.minY, box.maxY);
          return dx * dx + dy * dy;
        }

        function axisDist(k, min, max) {
          return k < min ? min - k : k <= max ? 0 : k - max;
        }
      },
      { tinyqueue: 20 },
    ],
    14: [
      function (require, module, exports) {
        "use strict";

        module.exports = rbush;
        module.exports.default = rbush;

        var quickselect = require("quickselect");

        function rbush(maxEntries, format) {
          if (!(this instanceof rbush)) return new rbush(maxEntries, format);

          // max entries in a node is 9 by default; min node fill is 40% for best performance
          this._maxEntries = Math.max(4, maxEntries || 9);
          this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

          if (format) {
            this._initFormat(format);
          }

          this.clear();
        }

        rbush.prototype = {
          all: function () {
            return this._all(this.data, []);
          },

          search: function (bbox) {
            var node = this.data,
              result = [],
              toBBox = this.toBBox;

            if (!intersects(bbox, node)) return result;

            var nodesToSearch = [],
              i,
              len,
              child,
              childBBox;

            while (node) {
              for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                  if (node.leaf) result.push(child);
                  else if (contains(bbox, childBBox)) this._all(child, result);
                  else nodesToSearch.push(child);
                }
              }
              node = nodesToSearch.pop();
            }

            return result;
          },

          collides: function (bbox) {
            var node = this.data,
              toBBox = this.toBBox;

            if (!intersects(bbox, node)) return false;

            var nodesToSearch = [],
              i,
              len,
              child,
              childBBox;

            while (node) {
              for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                  if (node.leaf || contains(bbox, childBBox)) return true;
                  nodesToSearch.push(child);
                }
              }
              node = nodesToSearch.pop();
            }

            return false;
          },

          load: function (data) {
            if (!(data && data.length)) return this;

            if (data.length < this._minEntries) {
              for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
              }
              return this;
            }

            // recursively build the tree with the given data from scratch using OMT algorithm
            var node = this._build(data.slice(), 0, data.length - 1, 0);

            if (!this.data.children.length) {
              // save as is if tree is empty
              this.data = node;
            } else if (this.data.height === node.height) {
              // split root if trees have the same height
              this._splitRoot(this.data, node);
            } else {
              if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
              }

              // insert the small tree into the large tree at appropriate level
              this._insert(node, this.data.height - node.height - 1, true);
            }

            return this;
          },

          insert: function (item) {
            if (item) this._insert(item, this.data.height - 1);
            return this;
          },

          clear: function () {
            this.data = createNode([]);
            return this;
          },

          remove: function (item, equalsFn) {
            if (!item) return this;

            var node = this.data,
              bbox = this.toBBox(item),
              path = [],
              indexes = [],
              i,
              parent,
              index,
              goingUp;

            // depth-first iterative tree traversal
            while (node || path.length) {
              if (!node) {
                // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
              }

              if (node.leaf) {
                // check current node
                index = findItem(item, node.children, equalsFn);

                if (index !== -1) {
                  // item found, remove the item and condense tree upwards
                  node.children.splice(index, 1);
                  path.push(node);
                  this._condense(path);
                  return this;
                }
              }

              if (!goingUp && !node.leaf && contains(node, bbox)) {
                // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];
              } else if (parent) {
                // go right
                i++;
                node = parent.children[i];
                goingUp = false;
              } else node = null; // nothing found
            }

            return this;
          },

          toBBox: function (item) {
            return item;
          },

          compareMinX: compareNodeMinX,
          compareMinY: compareNodeMinY,

          toJSON: function () {
            return this.data;
          },

          fromJSON: function (data) {
            this.data = data;
            return this;
          },

          _all: function (node, result) {
            var nodesToSearch = [];
            while (node) {
              if (node.leaf) result.push.apply(result, node.children);
              else nodesToSearch.push.apply(nodesToSearch, node.children);

              node = nodesToSearch.pop();
            }
            return result;
          },

          _build: function (items, left, right, height) {
            var N = right - left + 1,
              M = this._maxEntries,
              node;

            if (N <= M) {
              // reached leaf level; return leaf
              node = createNode(items.slice(left, right + 1));
              calcBBox(node, this.toBBox);
              return node;
            }

            if (!height) {
              // target height of the bulk-loaded tree
              height = Math.ceil(Math.log(N) / Math.log(M));

              // target number of root entries to maximize storage utilization
              M = Math.ceil(N / Math.pow(M, height - 1));
            }

            node = createNode([]);
            node.leaf = false;
            node.height = height;

            // split the items into M mostly square tiles

            var N2 = Math.ceil(N / M),
              N1 = N2 * Math.ceil(Math.sqrt(M)),
              i,
              j,
              right2,
              right3;

            multiSelect(items, left, right, N1, this.compareMinX);

            for (i = left; i <= right; i += N1) {
              right2 = Math.min(i + N1 - 1, right);

              multiSelect(items, i, right2, N2, this.compareMinY);

              for (j = i; j <= right2; j += N2) {
                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
              }
            }

            calcBBox(node, this.toBBox);

            return node;
          },

          _chooseSubtree: function (bbox, node, level, path) {
            var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

            while (true) {
              path.push(node);

              if (node.leaf || path.length - 1 === level) break;

              minArea = minEnlargement = Infinity;

              for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child);
                enlargement = enlargedArea(bbox, child) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                  minEnlargement = enlargement;
                  minArea = area < minArea ? area : minArea;
                  targetNode = child;
                } else if (enlargement === minEnlargement) {
                  // otherwise choose one with the smallest area
                  if (area < minArea) {
                    minArea = area;
                    targetNode = child;
                  }
                }
              }

              node = targetNode || node.children[0];
            }

            return node;
          },

          _insert: function (item, level, isNode) {
            var toBBox = this.toBBox,
              bbox = isNode ? item : toBBox(item),
              insertPath = [];

            // find the best node for accommodating the item, saving all nodes along the path too
            var node = this._chooseSubtree(bbox, this.data, level, insertPath);

            // put the item into the node
            node.children.push(item);
            extend(node, bbox);

            // split on node overflow; propagate upwards if necessary
            while (level >= 0) {
              if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
              } else break;
            }

            // adjust bboxes along the insertion path
            this._adjustParentBBoxes(bbox, insertPath, level);
          },

          // split overflowed node into two
          _split: function (insertPath, level) {
            var node = insertPath[level],
              M = node.children.length,
              m = this._minEntries;

            this._chooseSplitAxis(node, m, M);

            var splitIndex = this._chooseSplitIndex(node, m, M);

            var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
            newNode.height = node.height;
            newNode.leaf = node.leaf;

            calcBBox(node, this.toBBox);
            calcBBox(newNode, this.toBBox);

            if (level) insertPath[level - 1].children.push(newNode);
            else this._splitRoot(node, newNode);
          },

          _splitRoot: function (node, newNode) {
            // split root node
            this.data = createNode([node, newNode]);
            this.data.height = node.height + 1;
            this.data.leaf = false;
            calcBBox(this.data, this.toBBox);
          },

          _chooseSplitIndex: function (node, m, M) {
            var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

            minOverlap = minArea = Infinity;

            for (i = m; i <= M - m; i++) {
              bbox1 = distBBox(node, 0, i, this.toBBox);
              bbox2 = distBBox(node, i, M, this.toBBox);

              overlap = intersectionArea(bbox1, bbox2);
              area = bboxArea(bbox1) + bboxArea(bbox2);

              // choose distribution with minimum overlap
              if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;
              } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                  minArea = area;
                  index = i;
                }
              }
            }

            return index;
          },

          // sorts node children by the best axis for split
          _chooseSplitAxis: function (node, m, M) {
            var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
              compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
              xMargin = this._allDistMargin(node, m, M, compareMinX),
              yMargin = this._allDistMargin(node, m, M, compareMinY);

            // if total distributions margin value is minimal for x, sort by minX,
            // otherwise it's already sorted by minY
            if (xMargin < yMargin) node.children.sort(compareMinX);
          },

          // total margin of all possible split distributions where each node is at least m full
          _allDistMargin: function (node, m, M, compare) {
            node.children.sort(compare);

            var toBBox = this.toBBox,
              leftBBox = distBBox(node, 0, m, toBBox),
              rightBBox = distBBox(node, M - m, M, toBBox),
              margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
              i,
              child;

            for (i = m; i < M - m; i++) {
              child = node.children[i];
              extend(leftBBox, node.leaf ? toBBox(child) : child);
              margin += bboxMargin(leftBBox);
            }

            for (i = M - m - 1; i >= m; i--) {
              child = node.children[i];
              extend(rightBBox, node.leaf ? toBBox(child) : child);
              margin += bboxMargin(rightBBox);
            }

            return margin;
          },

          _adjustParentBBoxes: function (bbox, path, level) {
            // adjust bboxes along the given tree path
            for (var i = level; i >= 0; i--) {
              extend(path[i], bbox);
            }
          },

          _condense: function (path) {
            // go through the path, removing empty nodes and updating bboxes
            for (var i = path.length - 1, siblings; i >= 0; i--) {
              if (path[i].children.length === 0) {
                if (i > 0) {
                  siblings = path[i - 1].children;
                  siblings.splice(siblings.indexOf(path[i]), 1);
                } else this.clear();
              } else calcBBox(path[i], this.toBBox);
            }
          },

          _initFormat: function (format) {
            // data format (minX, minY, maxX, maxY accessors)

            // uses eval-type function compilation instead of just accepting a toBBox function
            // because the algorithms are very sensitive to sorting functions performance,
            // so they should be dead simple and without inner calls

            var compareArr = ["return a", " - b", ";"];

            this.compareMinX = new Function("a", "b", compareArr.join(format[0]));
            this.compareMinY = new Function("a", "b", compareArr.join(format[1]));

            this.toBBox = new Function(
              "a",
              "return {minX: a" + format[0] + ", minY: a" + format[1] + ", maxX: a" + format[2] + ", maxY: a" + format[3] + "};"
            );
          },
        };

        function findItem(item, items, equalsFn) {
          if (!equalsFn) return items.indexOf(item);

          for (var i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i])) return i;
          }
          return -1;
        }

        // calculate node's bbox from bboxes of its children
        function calcBBox(node, toBBox) {
          distBBox(node, 0, node.children.length, toBBox, node);
        }

        // min bounding rectangle of node children from k to p-1
        function distBBox(node, k, p, toBBox, destNode) {
          if (!destNode) destNode = createNode(null);
          destNode.minX = Infinity;
          destNode.minY = Infinity;
          destNode.maxX = -Infinity;
          destNode.maxY = -Infinity;

          for (var i = k, child; i < p; i++) {
            child = node.children[i];
            extend(destNode, node.leaf ? toBBox(child) : child);
          }

          return destNode;
        }

        function extend(a, b) {
          a.minX = Math.min(a.minX, b.minX);
          a.minY = Math.min(a.minY, b.minY);
          a.maxX = Math.max(a.maxX, b.maxX);
          a.maxY = Math.max(a.maxY, b.maxY);
          return a;
        }

        function compareNodeMinX(a, b) {
          return a.minX - b.minX;
        }
        function compareNodeMinY(a, b) {
          return a.minY - b.minY;
        }

        function bboxArea(a) {
          return (a.maxX - a.minX) * (a.maxY - a.minY);
        }
        function bboxMargin(a) {
          return a.maxX - a.minX + (a.maxY - a.minY);
        }

        function enlargedArea(a, b) {
          return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
        }

        function intersectionArea(a, b) {
          var minX = Math.max(a.minX, b.minX),
            minY = Math.max(a.minY, b.minY),
            maxX = Math.min(a.maxX, b.maxX),
            maxY = Math.min(a.maxY, b.maxY);

          return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
        }

        function contains(a, b) {
          return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
        }

        function intersects(a, b) {
          return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
        }

        function createNode(children) {
          return {
            children: children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
          };
        }

        // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
        // combines selection algorithm with binary divide & conquer approach

        function multiSelect(arr, left, right, n, compare) {
          var stack = [left, right],
            mid;

          while (stack.length) {
            right = stack.pop();
            left = stack.pop();

            if (right - left <= n) continue;

            mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect(arr, mid, left, right, compare);

            stack.push(left, mid, mid, right);
          }
        }
      },
      { quickselect: 12 },
    ],
    15: [
      function (require, module, exports) {
        !(function (t, r) {
          "object" == typeof exports && "undefined" != typeof module
            ? r(exports)
            : "function" == typeof define && define.amd
              ? define(["exports"], r)
              : r((t.svgpathdata = {}));
        })(this, function (t) {
          "use strict";
          var r =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, r) {
                t.__proto__ = r;
              }) ||
            function (t, r) {
              for (var e in r) r.hasOwnProperty(e) && (t[e] = r[e]);
            };
          function e(t, e) {
            function a() {
              this.constructor = t;
            }
            r(t, e), (t.prototype = null === e ? Object.create(e) : ((a.prototype = e.prototype), new a()));
          }
          function a(t, r) {
            var e = t[0],
              a = t[1];
            return [e * Math.cos(r) - a * Math.sin(r), e * Math.sin(r) + a * Math.cos(r)];
          }
          function n() {
            for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
            for (var e = 0; e < t.length; e++)
              if ("number" != typeof t[e])
                throw new Error("assertNumbers arguments[" + e + "] is not a number. " + typeof t[e] + " == typeof " + t[e]);
            return !0;
          }
          var i = Math.PI;
          function o(t, r, e) {
            (t.lArcFlag = 0 === t.lArcFlag ? 0 : 1), (t.sweepFlag = 0 === t.sweepFlag ? 0 : 1);
            var n = t.rX,
              o = t.rY,
              s = t.x,
              u = t.y;
            (n = Math.abs(t.rX)), (o = Math.abs(t.rY));
            var h = a([(r - s) / 2, (e - u) / 2], (-t.xRot / 180) * i),
              c = h[0],
              m = h[1],
              y = Math.pow(c, 2) / Math.pow(n, 2) + Math.pow(m, 2) / Math.pow(o, 2);
            1 < y && ((n *= Math.sqrt(y)), (o *= Math.sqrt(y))), (t.rX = n), (t.rY = o);
            var p = Math.pow(n, 2) * Math.pow(m, 2) + Math.pow(o, 2) * Math.pow(c, 2),
              T = (t.lArcFlag !== t.sweepFlag ? 1 : -1) * Math.sqrt(Math.max(0, (Math.pow(n, 2) * Math.pow(o, 2) - p) / p)),
              O = ((n * m) / o) * T,
              _ = ((-o * c) / n) * T,
              f = a([O, _], (t.xRot / 180) * i);
            (t.cX = f[0] + (r + s) / 2),
              (t.cY = f[1] + (e + u) / 2),
              (t.phi1 = Math.atan2((m - _) / o, (c - O) / n)),
              (t.phi2 = Math.atan2((-m - _) / o, (-c - O) / n)),
              0 === t.sweepFlag && t.phi2 > t.phi1 && (t.phi2 -= 2 * i),
              1 === t.sweepFlag && t.phi2 < t.phi1 && (t.phi2 += 2 * i),
              (t.phi1 *= 180 / i),
              (t.phi2 *= 180 / i);
          }
          function s(t, r, e) {
            n(t, r, e);
            var a = t * t + r * r - e * e;
            if (0 > a) return [];
            if (0 === a) return [[(t * e) / (t * t + r * r), (r * e) / (t * t + r * r)]];
            var i = Math.sqrt(a);
            return [
              [(t * e + r * i) / (t * t + r * r), (r * e - t * i) / (t * t + r * r)],
              [(t * e - r * i) / (t * t + r * r), (r * e + t * i) / (t * t + r * r)],
            ];
          }
          var u = Math.PI / 180;
          function h(t, r, e) {
            return (1 - e) * t + e * r;
          }
          function c(t, r, e, a) {
            return t + Math.cos((a / 180) * i) * r + Math.sin((a / 180) * i) * e;
          }
          function m(t, r, e, a) {
            var n = r - t,
              i = e - r,
              o = 3 * n + 3 * (a - e) - 6 * i,
              s = 6 * (i - n),
              u = 3 * n;
            return Math.abs(o) < 1e-6
              ? [-u / s]
              : (function (t, r, e) {
                  void 0 === e && (e = 1e-6);
                  var a = (t * t) / 4 - r;
                  if (a < -e) return [];
                  if (a <= e) return [-t / 2];
                  var n = Math.sqrt(a);
                  return [-t / 2 - n, -t / 2 + n];
                })(s / o, u / o, 1e-6);
          }
          function y(t, r, e, a, n) {
            var i = 1 - n;
            return t * (i * i * i) + r * (3 * i * i * n) + e * (3 * i * n * n) + a * (n * n * n);
          }
          !(function (t) {
            function r() {
              return p(function (t, r, e) {
                return (
                  t.relative &&
                    (void 0 !== t.x1 && (t.x1 += r),
                    void 0 !== t.y1 && (t.y1 += e),
                    void 0 !== t.x2 && (t.x2 += r),
                    void 0 !== t.y2 && (t.y2 += e),
                    void 0 !== t.x && (t.x += r),
                    void 0 !== t.y && (t.y += e),
                    (t.relative = !1)),
                  t
                );
              });
            }
            function e() {
              var t = NaN,
                r = NaN,
                e = NaN,
                a = NaN;
              return p(function (n, i, o) {
                return (
                  n.type & l.SMOOTH_CURVE_TO &&
                    ((n.type = l.CURVE_TO),
                    (t = isNaN(t) ? i : t),
                    (r = isNaN(r) ? o : r),
                    (n.x1 = n.relative ? i - t : 2 * i - t),
                    (n.y1 = n.relative ? o - r : 2 * o - r)),
                  n.type & l.CURVE_TO ? ((t = n.relative ? i + n.x2 : n.x2), (r = n.relative ? o + n.y2 : n.y2)) : ((t = NaN), (r = NaN)),
                  n.type & l.SMOOTH_QUAD_TO &&
                    ((n.type = l.QUAD_TO),
                    (e = isNaN(e) ? i : e),
                    (a = isNaN(a) ? o : a),
                    (n.x1 = n.relative ? i - e : 2 * i - e),
                    (n.y1 = n.relative ? o - a : 2 * o - a)),
                  n.type & l.QUAD_TO ? ((e = n.relative ? i + n.x1 : n.x1), (a = n.relative ? o + n.y1 : n.y1)) : ((e = NaN), (a = NaN)),
                  n
                );
              });
            }
            function i() {
              var t = NaN,
                r = NaN;
              return p(function (e, a, n) {
                if (
                  (e.type & l.SMOOTH_QUAD_TO &&
                    ((e.type = l.QUAD_TO),
                    (t = isNaN(t) ? a : t),
                    (r = isNaN(r) ? n : r),
                    (e.x1 = e.relative ? a - t : 2 * a - t),
                    (e.y1 = e.relative ? n - r : 2 * n - r)),
                  e.type & l.QUAD_TO)
                ) {
                  (t = e.relative ? a + e.x1 : e.x1), (r = e.relative ? n + e.y1 : e.y1);
                  var i = e.x1,
                    o = e.y1;
                  (e.type = l.CURVE_TO),
                    (e.x1 = ((e.relative ? 0 : a) + 2 * i) / 3),
                    (e.y1 = ((e.relative ? 0 : n) + 2 * o) / 3),
                    (e.x2 = (e.x + 2 * i) / 3),
                    (e.y2 = (e.y + 2 * o) / 3);
                } else (t = NaN), (r = NaN);
                return e;
              });
            }
            function p(t) {
              var r = 0,
                e = 0,
                a = NaN,
                n = NaN;
              return function (i) {
                if (isNaN(a) && !(i.type & l.MOVE_TO)) throw new Error("path must start with moveto");
                var o = t(i, r, e, a, n);
                return (
                  i.type & l.CLOSE_PATH && ((r = a), (e = n)),
                  void 0 !== i.x && (r = i.relative ? r + i.x : i.x),
                  void 0 !== i.y && (e = i.relative ? e + i.y : i.y),
                  i.type & l.MOVE_TO && ((a = r), (n = e)),
                  o
                );
              };
            }
            function T(t, r, e, a, i, o) {
              return (
                n(t, r, e, a, i, o),
                p(function (n, s, u, h) {
                  var c = n.x1,
                    m = n.x2,
                    y = n.relative && !isNaN(h),
                    p = void 0 !== n.x ? n.x : y ? 0 : s,
                    T = void 0 !== n.y ? n.y : y ? 0 : u;
                  function O(t) {
                    return t * t;
                  }
                  n.type & l.HORIZ_LINE_TO && 0 !== r && ((n.type = l.LINE_TO), (n.y = n.relative ? 0 : u)),
                    n.type & l.VERT_LINE_TO && 0 !== e && ((n.type = l.LINE_TO), (n.x = n.relative ? 0 : s)),
                    void 0 !== n.x && (n.x = n.x * t + T * e + (y ? 0 : i)),
                    void 0 !== n.y && (n.y = p * r + n.y * a + (y ? 0 : o)),
                    void 0 !== n.x1 && (n.x1 = n.x1 * t + n.y1 * e + (y ? 0 : i)),
                    void 0 !== n.y1 && (n.y1 = c * r + n.y1 * a + (y ? 0 : o)),
                    void 0 !== n.x2 && (n.x2 = n.x2 * t + n.y2 * e + (y ? 0 : i)),
                    void 0 !== n.y2 && (n.y2 = m * r + n.y2 * a + (y ? 0 : o));
                  var _ = t * a - r * e;
                  if (void 0 !== n.xRot && (1 !== t || 0 !== r || 0 !== e || 1 !== a))
                    if (0 === _) delete n.rX, delete n.rY, delete n.xRot, delete n.lArcFlag, delete n.sweepFlag, (n.type = l.LINE_TO);
                    else {
                      var f = (n.xRot * Math.PI) / 180,
                        v = Math.sin(f),
                        N = Math.cos(f),
                        E = 1 / O(n.rX),
                        d = 1 / O(n.rY),
                        A = O(N) * E + O(v) * d,
                        x = 2 * v * N * (E - d),
                        C = O(v) * E + O(N) * d,
                        M = A * a * a - x * r * a + C * r * r,
                        R = x * (t * a + r * e) - 2 * (A * e * a + C * t * r),
                        S = A * e * e - x * t * e + C * t * t,
                        I = ((Math.atan2(R, M - S) + Math.PI) % Math.PI) / 2,
                        g = Math.sin(I),
                        V = Math.cos(I);
                      (n.rX = Math.abs(_) / Math.sqrt(M * O(V) + R * g * V + S * O(g))),
                        (n.rY = Math.abs(_) / Math.sqrt(M * O(g) - R * g * V + S * O(V))),
                        (n.xRot = (180 * I) / Math.PI);
                    }
                  return void 0 !== n.sweepFlag && 0 > _ && (n.sweepFlag = +!n.sweepFlag), n;
                })
              );
            }
            function O() {
              return function (t) {
                var r = {};
                for (var e in t) r[e] = t[e];
                return r;
              };
            }
            (t.ROUND = function (t) {
              function r(r) {
                return Math.round(r * t) / t;
              }
              return (
                void 0 === t && (t = 1e13),
                n(t),
                function (t) {
                  return (
                    void 0 !== t.x1 && (t.x1 = r(t.x1)),
                    void 0 !== t.y1 && (t.y1 = r(t.y1)),
                    void 0 !== t.x2 && (t.x2 = r(t.x2)),
                    void 0 !== t.y2 && (t.y2 = r(t.y2)),
                    void 0 !== t.x && (t.x = r(t.x)),
                    void 0 !== t.y && (t.y = r(t.y)),
                    t
                  );
                }
              );
            }),
              (t.TO_ABS = r),
              (t.TO_REL = function () {
                return p(function (t, r, e) {
                  return (
                    t.relative ||
                      (void 0 !== t.x1 && (t.x1 -= r),
                      void 0 !== t.y1 && (t.y1 -= e),
                      void 0 !== t.x2 && (t.x2 -= r),
                      void 0 !== t.y2 && (t.y2 -= e),
                      void 0 !== t.x && (t.x -= r),
                      void 0 !== t.y && (t.y -= e),
                      (t.relative = !0)),
                    t
                  );
                });
              }),
              (t.NORMALIZE_HVZ = function (t, r, e) {
                return (
                  void 0 === t && (t = !0),
                  void 0 === r && (r = !0),
                  void 0 === e && (e = !0),
                  p(function (a, n, i, o, s) {
                    if (isNaN(o) && !(a.type & l.MOVE_TO)) throw new Error("path must start with moveto");
                    return (
                      r && a.type & l.HORIZ_LINE_TO && ((a.type = l.LINE_TO), (a.y = a.relative ? 0 : i)),
                      e && a.type & l.VERT_LINE_TO && ((a.type = l.LINE_TO), (a.x = a.relative ? 0 : n)),
                      t && a.type & l.CLOSE_PATH && ((a.type = l.LINE_TO), (a.x = a.relative ? o - n : o), (a.y = a.relative ? s - i : s)),
                      a.type & l.ARC &&
                        (0 === a.rX || 0 === a.rY) &&
                        ((a.type = l.LINE_TO), delete a.rX, delete a.rY, delete a.xRot, delete a.lArcFlag, delete a.sweepFlag),
                      a
                    );
                  })
                );
              }),
              (t.NORMALIZE_ST = e),
              (t.QT_TO_C = i),
              (t.INFO = p),
              (t.SANITIZE = function (t) {
                void 0 === t && (t = 0), n(t);
                var r = NaN,
                  e = NaN,
                  a = NaN,
                  i = NaN;
                return p(function (n, o, s, u, h) {
                  var c = Math.abs,
                    m = !1,
                    y = 0,
                    p = 0;
                  if (
                    (n.type & l.SMOOTH_CURVE_TO && ((y = isNaN(r) ? 0 : o - r), (p = isNaN(e) ? 0 : s - e)),
                    n.type & (l.CURVE_TO | l.SMOOTH_CURVE_TO)
                      ? ((r = n.relative ? o + n.x2 : n.x2), (e = n.relative ? s + n.y2 : n.y2))
                      : ((r = NaN), (e = NaN)),
                    n.type & l.SMOOTH_QUAD_TO
                      ? ((a = isNaN(a) ? o : 2 * o - a), (i = isNaN(i) ? s : 2 * s - i))
                      : n.type & l.QUAD_TO
                        ? ((a = n.relative ? o + n.x1 : n.x1), (i = n.relative ? s + n.y1 : n.y2))
                        : ((a = NaN), (i = NaN)),
                    n.type & l.LINE_COMMANDS ||
                      (n.type & l.ARC && (0 === n.rX || 0 === n.rY || !n.lArcFlag)) ||
                      n.type & l.CURVE_TO ||
                      n.type & l.SMOOTH_CURVE_TO ||
                      n.type & l.QUAD_TO ||
                      n.type & l.SMOOTH_QUAD_TO)
                  ) {
                    var T = void 0 === n.x ? 0 : n.relative ? n.x : n.x - o,
                      O = void 0 === n.y ? 0 : n.relative ? n.y : n.y - s;
                    (y = isNaN(a) ? (void 0 === n.x1 ? y : n.relative ? n.x : n.x1 - o) : a - o),
                      (p = isNaN(i) ? (void 0 === n.y1 ? p : n.relative ? n.y : n.y1 - s) : i - s);
                    var _ = void 0 === n.x2 ? 0 : n.relative ? n.x : n.x2 - o,
                      f = void 0 === n.y2 ? 0 : n.relative ? n.y : n.y2 - s;
                    c(T) <= t && c(O) <= t && c(y) <= t && c(p) <= t && c(_) <= t && c(f) <= t && (m = !0);
                  }
                  return n.type & l.CLOSE_PATH && c(o - u) <= t && c(s - h) <= t && (m = !0), m ? [] : n;
                });
              }),
              (t.MATRIX = T),
              (t.ROTATE = function (t, r, e) {
                void 0 === r && (r = 0), void 0 === e && (e = 0), n(t, r, e);
                var a = Math.sin(t),
                  i = Math.cos(t);
                return T(i, a, -a, i, r - r * i + e * a, e - r * a - e * i);
              }),
              (t.TRANSLATE = function (t, r) {
                return void 0 === r && (r = 0), n(t, r), T(1, 0, 0, 1, t, r);
              }),
              (t.SCALE = function (t, r) {
                return void 0 === r && (r = t), n(t, r), T(t, 0, 0, r, 0, 0);
              }),
              (t.SKEW_X = function (t) {
                return n(t), T(1, 0, Math.atan(t), 1, 0, 0);
              }),
              (t.SKEW_Y = function (t) {
                return n(t), T(1, Math.atan(t), 0, 1, 0, 0);
              }),
              (t.X_AXIS_SYMMETRY = function (t) {
                return void 0 === t && (t = 0), n(t), T(-1, 0, 0, 1, t, 0);
              }),
              (t.Y_AXIS_SYMMETRY = function (t) {
                return void 0 === t && (t = 0), n(t), T(1, 0, 0, -1, 0, t);
              }),
              (t.A_TO_C = function () {
                return p(function (t, r, e) {
                  return l.ARC === t.type
                    ? (function (t, r, e) {
                        var n, i, s, c;
                        t.cX || o(t, r, e);
                        for (
                          var m = Math.min(t.phi1, t.phi2),
                            y = Math.max(t.phi1, t.phi2) - m,
                            p = Math.ceil(y / 90),
                            T = new Array(p),
                            O = r,
                            _ = e,
                            f = 0;
                          f < p;
                          f++
                        ) {
                          var v = h(t.phi1, t.phi2, f / p),
                            N = h(t.phi1, t.phi2, (f + 1) / p),
                            E = N - v,
                            d = (4 / 3) * Math.tan((E * u) / 4),
                            A = [Math.cos(v * u) - d * Math.sin(v * u), Math.sin(v * u) + d * Math.cos(v * u)],
                            x = A[0],
                            C = A[1],
                            M = [Math.cos(N * u), Math.sin(N * u)],
                            R = M[0],
                            S = M[1],
                            I = [R + d * Math.sin(N * u), S - d * Math.cos(N * u)],
                            g = I[0],
                            V = I[1];
                          T[f] = { relative: t.relative, type: l.CURVE_TO };
                          var L = function (r, e) {
                            var n = a([r * t.rX, e * t.rY], t.xRot),
                              i = n[0],
                              o = n[1];
                            return [t.cX + i, t.cY + o];
                          };
                          (n = L(x, C)),
                            (T[f].x1 = n[0]),
                            (T[f].y1 = n[1]),
                            (i = L(g, V)),
                            (T[f].x2 = i[0]),
                            (T[f].y2 = i[1]),
                            (s = L(R, S)),
                            (T[f].x = s[0]),
                            (T[f].y = s[1]),
                            t.relative && ((T[f].x1 -= O), (T[f].y1 -= _), (T[f].x2 -= O), (T[f].y2 -= _), (T[f].x -= O), (T[f].y -= _)),
                            (O = (c = [T[f].x, T[f].y])[0]),
                            (_ = c[1]);
                        }
                        return T;
                      })(t, t.relative ? 0 : r, t.relative ? 0 : e)
                    : t;
                });
              }),
              (t.ANNOTATE_ARCS = function () {
                return p(function (t, r, e) {
                  return t.relative && ((r = 0), (e = 0)), l.ARC === t.type && o(t, r, e), t;
                });
              }),
              (t.CLONE = O),
              (t.CALCULATE_BOUNDS = function () {
                var t = function (t) {
                    var r = {};
                    for (var e in t) r[e] = t[e];
                    return r;
                  },
                  a = r(),
                  n = i(),
                  u = e(),
                  h = p(function (r, e, i) {
                    var p = u(n(a(t(r))));
                    function T(t) {
                      t > h.maxX && (h.maxX = t), t < h.minX && (h.minX = t);
                    }
                    function O(t) {
                      t > h.maxY && (h.maxY = t), t < h.minY && (h.minY = t);
                    }
                    if (
                      (p.type & l.DRAWING_COMMANDS && (T(e), O(i)),
                      p.type & l.HORIZ_LINE_TO && T(p.x),
                      p.type & l.VERT_LINE_TO && O(p.y),
                      p.type & l.LINE_TO && (T(p.x), O(p.y)),
                      p.type & l.CURVE_TO)
                    ) {
                      T(p.x), O(p.y);
                      for (var _ = 0, f = m(e, p.x1, p.x2, p.x); _ < f.length; _++) 0 < (U = f[_]) && 1 > U && T(y(e, p.x1, p.x2, p.x, U));
                      for (var v = 0, N = m(i, p.y1, p.y2, p.y); v < N.length; v++) 0 < (U = N[v]) && 1 > U && O(y(i, p.y1, p.y2, p.y, U));
                    }
                    if (p.type & l.ARC) {
                      T(p.x), O(p.y), o(p, e, i);
                      for (
                        var E = (p.xRot / 180) * Math.PI,
                          d = Math.cos(E) * p.rX,
                          A = Math.sin(E) * p.rX,
                          x = -Math.sin(E) * p.rY,
                          C = Math.cos(E) * p.rY,
                          M = p.phi1 < p.phi2 ? [p.phi1, p.phi2] : -180 > p.phi2 ? [p.phi2 + 360, p.phi1 + 360] : [p.phi2, p.phi1],
                          R = M[0],
                          S = M[1],
                          I = function (t) {
                            var r = t[0],
                              e = t[1],
                              a = (180 * Math.atan2(e, r)) / Math.PI;
                            return a < R ? a + 360 : a;
                          },
                          g = 0,
                          V = s(x, -d, 0).map(I);
                        g < V.length;
                        g++
                      )
                        (U = V[g]) > R && U < S && T(c(p.cX, d, x, U));
                      for (var L = 0, D = s(C, -A, 0).map(I); L < D.length; L++) {
                        var U;
                        (U = D[L]) > R && U < S && O(c(p.cY, A, C, U));
                      }
                    }
                    return r;
                  });
                return (h.minX = 1 / 0), (h.maxX = -1 / 0), (h.minY = 1 / 0), (h.maxY = -1 / 0), h;
              });
          })(t.SVGPathDataTransformer || (t.SVGPathDataTransformer = {}));
          var p,
            T,
            O = (function () {
              function r() {}
              return (
                (r.prototype.round = function (r) {
                  return this.transform(t.SVGPathDataTransformer.ROUND(r));
                }),
                (r.prototype.toAbs = function () {
                  return this.transform(t.SVGPathDataTransformer.TO_ABS());
                }),
                (r.prototype.toRel = function () {
                  return this.transform(t.SVGPathDataTransformer.TO_REL());
                }),
                (r.prototype.normalizeHVZ = function (r, e, a) {
                  return this.transform(t.SVGPathDataTransformer.NORMALIZE_HVZ(r, e, a));
                }),
                (r.prototype.normalizeST = function () {
                  return this.transform(t.SVGPathDataTransformer.NORMALIZE_ST());
                }),
                (r.prototype.qtToC = function () {
                  return this.transform(t.SVGPathDataTransformer.QT_TO_C());
                }),
                (r.prototype.aToC = function () {
                  return this.transform(t.SVGPathDataTransformer.A_TO_C());
                }),
                (r.prototype.sanitize = function (r) {
                  return this.transform(t.SVGPathDataTransformer.SANITIZE(r));
                }),
                (r.prototype.translate = function (r, e) {
                  return this.transform(t.SVGPathDataTransformer.TRANSLATE(r, e));
                }),
                (r.prototype.scale = function (r, e) {
                  return this.transform(t.SVGPathDataTransformer.SCALE(r, e));
                }),
                (r.prototype.rotate = function (r, e, a) {
                  return this.transform(t.SVGPathDataTransformer.ROTATE(r, e, a));
                }),
                (r.prototype.matrix = function (r, e, a, n, i, o) {
                  return this.transform(t.SVGPathDataTransformer.MATRIX(r, e, a, n, i, o));
                }),
                (r.prototype.skewX = function (r) {
                  return this.transform(t.SVGPathDataTransformer.SKEW_X(r));
                }),
                (r.prototype.skewY = function (r) {
                  return this.transform(t.SVGPathDataTransformer.SKEW_Y(r));
                }),
                (r.prototype.xSymmetry = function (r) {
                  return this.transform(t.SVGPathDataTransformer.X_AXIS_SYMMETRY(r));
                }),
                (r.prototype.ySymmetry = function (r) {
                  return this.transform(t.SVGPathDataTransformer.Y_AXIS_SYMMETRY(r));
                }),
                (r.prototype.annotateArcs = function () {
                  return this.transform(t.SVGPathDataTransformer.ANNOTATE_ARCS());
                }),
                r
              );
            })(),
            _ = function (t) {
              return " " === t || "\t" === t || "\r" === t || "\n" === t;
            },
            f = function (t) {
              return "0".charCodeAt(0) <= t.charCodeAt(0) && t.charCodeAt(0) <= "9".charCodeAt(0);
            },
            v = (function (t) {
              function r() {
                var r = t.call(this) || this;
                return (
                  (r.curNumber = ""),
                  (r.curCommandType = -1),
                  (r.curCommandRelative = !1),
                  (r.canParseCommandOrComma = !0),
                  (r.curNumberHasExp = !1),
                  (r.curNumberHasExpDigits = !1),
                  (r.curNumberHasDecimal = !1),
                  (r.curArgs = []),
                  r
                );
              }
              return (
                e(r, t),
                (r.prototype.finish = function (t) {
                  if ((void 0 === t && (t = []), this.parse(" ", t), 0 !== this.curArgs.length || !this.canParseCommandOrComma))
                    throw new SyntaxError("Unterminated command at the path end.");
                  return t;
                }),
                (r.prototype.parse = function (t, r) {
                  var e = this;
                  void 0 === r && (r = []);
                  for (
                    var a = function (t) {
                        r.push(t), (e.curArgs.length = 0), (e.canParseCommandOrComma = !0);
                      },
                      n = 0;
                    n < t.length;
                    n++
                  ) {
                    var i = t[n];
                    if (f(i)) (this.curNumber += i), (this.curNumberHasExpDigits = this.curNumberHasExp);
                    else if ("e" !== i && "E" !== i)
                      if (("-" !== i && "+" !== i) || !this.curNumberHasExp || this.curNumberHasExpDigits)
                        if ("." !== i || this.curNumberHasExp || this.curNumberHasDecimal) {
                          if (this.curNumber && -1 !== this.curCommandType) {
                            var o = Number(this.curNumber);
                            if (isNaN(o)) throw new SyntaxError("Invalid number ending at " + n);
                            if (this.curCommandType === l.ARC)
                              if (0 === this.curArgs.length || 1 === this.curArgs.length) {
                                if (0 > o) throw new SyntaxError('Expected positive number, got "' + o + '" at index "' + n + '"');
                              } else if ((3 === this.curArgs.length || 4 === this.curArgs.length) && "0" !== this.curNumber && "1" !== this.curNumber)
                                throw new SyntaxError('Expected a flag, got "' + this.curNumber + '" at index "' + n + '"');
                            this.curArgs.push(o),
                              this.curArgs.length === N[this.curCommandType] &&
                                (l.HORIZ_LINE_TO === this.curCommandType
                                  ? a({ type: l.HORIZ_LINE_TO, relative: this.curCommandRelative, x: o })
                                  : l.VERT_LINE_TO === this.curCommandType
                                    ? a({ type: l.VERT_LINE_TO, relative: this.curCommandRelative, y: o })
                                    : this.curCommandType === l.MOVE_TO ||
                                        this.curCommandType === l.LINE_TO ||
                                        this.curCommandType === l.SMOOTH_QUAD_TO
                                      ? (a({ type: this.curCommandType, relative: this.curCommandRelative, x: this.curArgs[0], y: this.curArgs[1] }),
                                        l.MOVE_TO === this.curCommandType && (this.curCommandType = l.LINE_TO))
                                      : this.curCommandType === l.CURVE_TO
                                        ? a({
                                            type: l.CURVE_TO,
                                            relative: this.curCommandRelative,
                                            x1: this.curArgs[0],
                                            y1: this.curArgs[1],
                                            x2: this.curArgs[2],
                                            y2: this.curArgs[3],
                                            x: this.curArgs[4],
                                            y: this.curArgs[5],
                                          })
                                        : this.curCommandType === l.SMOOTH_CURVE_TO
                                          ? a({
                                              type: l.SMOOTH_CURVE_TO,
                                              relative: this.curCommandRelative,
                                              x2: this.curArgs[0],
                                              y2: this.curArgs[1],
                                              x: this.curArgs[2],
                                              y: this.curArgs[3],
                                            })
                                          : this.curCommandType === l.QUAD_TO
                                            ? a({
                                                type: l.QUAD_TO,
                                                relative: this.curCommandRelative,
                                                x1: this.curArgs[0],
                                                y1: this.curArgs[1],
                                                x: this.curArgs[2],
                                                y: this.curArgs[3],
                                              })
                                            : this.curCommandType === l.ARC &&
                                              a({
                                                type: l.ARC,
                                                relative: this.curCommandRelative,
                                                rX: this.curArgs[0],
                                                rY: this.curArgs[1],
                                                xRot: this.curArgs[2],
                                                lArcFlag: this.curArgs[3],
                                                sweepFlag: this.curArgs[4],
                                                x: this.curArgs[5],
                                                y: this.curArgs[6],
                                              })),
                              (this.curNumber = ""),
                              (this.curNumberHasExpDigits = !1),
                              (this.curNumberHasExp = !1),
                              (this.curNumberHasDecimal = !1),
                              (this.canParseCommandOrComma = !0);
                          }
                          if (!_(i))
                            if ("," === i && this.canParseCommandOrComma) this.canParseCommandOrComma = !1;
                            else if ("+" !== i && "-" !== i && "." !== i) {
                              if (0 !== this.curArgs.length) throw new SyntaxError("Unterminated command at index " + n + ".");
                              if (!this.canParseCommandOrComma)
                                throw new SyntaxError('Unexpected character "' + i + '" at index ' + n + ". Command cannot follow comma");
                              if (((this.canParseCommandOrComma = !1), "z" !== i && "Z" !== i))
                                if ("h" === i || "H" === i) (this.curCommandType = l.HORIZ_LINE_TO), (this.curCommandRelative = "h" === i);
                                else if ("v" === i || "V" === i) (this.curCommandType = l.VERT_LINE_TO), (this.curCommandRelative = "v" === i);
                                else if ("m" === i || "M" === i) (this.curCommandType = l.MOVE_TO), (this.curCommandRelative = "m" === i);
                                else if ("l" === i || "L" === i) (this.curCommandType = l.LINE_TO), (this.curCommandRelative = "l" === i);
                                else if ("c" === i || "C" === i) (this.curCommandType = l.CURVE_TO), (this.curCommandRelative = "c" === i);
                                else if ("s" === i || "S" === i) (this.curCommandType = l.SMOOTH_CURVE_TO), (this.curCommandRelative = "s" === i);
                                else if ("q" === i || "Q" === i) (this.curCommandType = l.QUAD_TO), (this.curCommandRelative = "q" === i);
                                else if ("t" === i || "T" === i) (this.curCommandType = l.SMOOTH_QUAD_TO), (this.curCommandRelative = "t" === i);
                                else {
                                  if ("a" !== i && "A" !== i) throw new SyntaxError('Unexpected character "' + i + '" at index ' + n + ".");
                                  (this.curCommandType = l.ARC), (this.curCommandRelative = "a" === i);
                                }
                              else r.push({ type: l.CLOSE_PATH }), (this.canParseCommandOrComma = !0), (this.curCommandType = -1);
                            } else (this.curNumber = i), (this.curNumberHasDecimal = "." === i);
                        } else (this.curNumber += i), (this.curNumberHasDecimal = !0);
                      else this.curNumber += i;
                    else (this.curNumber += i), (this.curNumberHasExp = !0);
                  }
                  return r;
                }),
                (r.prototype.transform = function (t) {
                  return Object.create(this, {
                    parse: {
                      value: function (r, e) {
                        void 0 === e && (e = []);
                        for (var a = 0, n = Object.getPrototypeOf(this).parse.call(this, r); a < n.length; a++) {
                          var i = n[a],
                            o = t(i);
                          Array.isArray(o) ? e.push.apply(e, o) : e.push(o);
                        }
                        return e;
                      },
                    },
                  });
                }),
                r
              );
            })(O),
            l = (function (r) {
              function a(t) {
                var e = r.call(this) || this;
                return (e.commands = "string" == typeof t ? a.parse(t) : t), e;
              }
              return (
                e(a, r),
                (a.prototype.encode = function () {
                  return a.encode(this.commands);
                }),
                (a.prototype.getBounds = function () {
                  var r = t.SVGPathDataTransformer.CALCULATE_BOUNDS();
                  return this.transform(r), r;
                }),
                (a.prototype.transform = function (t) {
                  for (var r = [], e = 0, a = this.commands; e < a.length; e++) {
                    var n = t(a[e]);
                    Array.isArray(n) ? r.push.apply(r, n) : r.push(n);
                  }
                  return (this.commands = r), this;
                }),
                (a.encode = function (t) {
                  return d(t);
                }),
                (a.parse = function (t) {
                  var r = new v(),
                    e = [];
                  return r.parse(t, e), r.finish(e), e;
                }),
                (a.CLOSE_PATH = 1),
                (a.MOVE_TO = 2),
                (a.HORIZ_LINE_TO = 4),
                (a.VERT_LINE_TO = 8),
                (a.LINE_TO = 16),
                (a.CURVE_TO = 32),
                (a.SMOOTH_CURVE_TO = 64),
                (a.QUAD_TO = 128),
                (a.SMOOTH_QUAD_TO = 256),
                (a.ARC = 512),
                (a.LINE_COMMANDS = a.LINE_TO | a.HORIZ_LINE_TO | a.VERT_LINE_TO),
                (a.DRAWING_COMMANDS =
                  a.HORIZ_LINE_TO | a.VERT_LINE_TO | a.LINE_TO | a.CURVE_TO | a.SMOOTH_CURVE_TO | a.QUAD_TO | a.SMOOTH_QUAD_TO | a.ARC),
                a
              );
            })(O),
            N =
              (((p = {})[l.MOVE_TO] = 2),
              (p[l.LINE_TO] = 2),
              (p[l.HORIZ_LINE_TO] = 1),
              (p[l.VERT_LINE_TO] = 1),
              (p[l.CLOSE_PATH] = 0),
              (p[l.QUAD_TO] = 4),
              (p[l.SMOOTH_QUAD_TO] = 2),
              (p[l.CURVE_TO] = 6),
              (p[l.SMOOTH_CURVE_TO] = 4),
              (p[l.ARC] = 7),
              p),
            E = " ";
          function d(t) {
            var r = "";
            Array.isArray(t) || (t = [t]);
            for (var e = 0; e < t.length; e++) {
              var a = t[e];
              if (a.type === l.CLOSE_PATH) r += "z";
              else if (a.type === l.HORIZ_LINE_TO) r += (a.relative ? "h" : "H") + a.x;
              else if (a.type === l.VERT_LINE_TO) r += (a.relative ? "v" : "V") + a.y;
              else if (a.type === l.MOVE_TO) r += (a.relative ? "m" : "M") + a.x + E + a.y;
              else if (a.type === l.LINE_TO) r += (a.relative ? "l" : "L") + a.x + E + a.y;
              else if (a.type === l.CURVE_TO) r += (a.relative ? "c" : "C") + a.x1 + E + a.y1 + E + a.x2 + E + a.y2 + E + a.x + E + a.y;
              else if (a.type === l.SMOOTH_CURVE_TO) r += (a.relative ? "s" : "S") + a.x2 + E + a.y2 + E + a.x + E + a.y;
              else if (a.type === l.QUAD_TO) r += (a.relative ? "q" : "Q") + a.x1 + E + a.y1 + E + a.x + E + a.y;
              else if (a.type === l.SMOOTH_QUAD_TO) r += (a.relative ? "t" : "T") + a.x + E + a.y;
              else {
                if (a.type !== l.ARC) throw new Error('Unexpected command type "' + a.type + '" at index ' + e + ".");
                r += (a.relative ? "a" : "A") + a.rX + E + a.rY + E + a.xRot + E + +a.lArcFlag + E + +a.sweepFlag + E + a.x + E + a.y;
              }
            }
            return r;
          }
          var A = (function (r) {
              function a(t) {
                var e = r.call(this) || this;
                return (e.commands = "string" == typeof t ? a.parse(t) : t), e;
              }
              return (
                e(a, r),
                (a.prototype.encode = function () {
                  return a.encode(this.commands);
                }),
                (a.prototype.getBounds = function () {
                  var r = t.SVGPathDataTransformer.CALCULATE_BOUNDS();
                  return this.transform(r), r;
                }),
                (a.prototype.transform = function (t) {
                  for (var r = [], e = 0, a = this.commands; e < a.length; e++) {
                    var n = t(a[e]);
                    Array.isArray(n) ? r.push.apply(r, n) : r.push(n);
                  }
                  return (this.commands = r), this;
                }),
                (a.encode = function (t) {
                  return d(t);
                }),
                (a.parse = function (t) {
                  var r = new v(),
                    e = [];
                  return r.parse(t, e), r.finish(e), e;
                }),
                (a.CLOSE_PATH = 1),
                (a.MOVE_TO = 2),
                (a.HORIZ_LINE_TO = 4),
                (a.VERT_LINE_TO = 8),
                (a.LINE_TO = 16),
                (a.CURVE_TO = 32),
                (a.SMOOTH_CURVE_TO = 64),
                (a.QUAD_TO = 128),
                (a.SMOOTH_QUAD_TO = 256),
                (a.ARC = 512),
                (a.LINE_COMMANDS = a.LINE_TO | a.HORIZ_LINE_TO | a.VERT_LINE_TO),
                (a.DRAWING_COMMANDS =
                  a.HORIZ_LINE_TO | a.VERT_LINE_TO | a.LINE_TO | a.CURVE_TO | a.SMOOTH_CURVE_TO | a.QUAD_TO | a.SMOOTH_QUAD_TO | a.ARC),
                a
              );
            })(O),
            x =
              (((T = {})[A.MOVE_TO] = 2),
              (T[A.LINE_TO] = 2),
              (T[A.HORIZ_LINE_TO] = 1),
              (T[A.VERT_LINE_TO] = 1),
              (T[A.CLOSE_PATH] = 0),
              (T[A.QUAD_TO] = 4),
              (T[A.SMOOTH_QUAD_TO] = 2),
              (T[A.CURVE_TO] = 6),
              (T[A.SMOOTH_CURVE_TO] = 4),
              (T[A.ARC] = 7),
              T);
          (t.SVGPathData = A),
            (t.COMMAND_ARG_COUNTS = x),
            (t.encodeSVGPath = d),
            (t.SVGPathDataParser = v),
            Object.defineProperty(t, "__esModule", { value: !0 });
        });
      },
      {},
    ],
    16: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        exports.valid = exports.toPoints = exports.toPath = undefined;

        var _toPath = require("./toPath");

        var _toPath2 = _interopRequireDefault(_toPath);

        var _toPoints = require("./toPoints");

        var _toPoints2 = _interopRequireDefault(_toPoints);

        var _valid = require("./valid");

        var _valid2 = _interopRequireDefault(_valid);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        exports.toPath = _toPath2.default;
        exports.toPoints = _toPoints2.default;
        exports.valid = _valid2.default;
      },
      { "./toPath": 17, "./toPoints": 18, "./valid": 19 },
    ],
    17: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _toPoints = require("./toPoints");

        var _toPoints2 = _interopRequireDefault(_toPoints);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        }

        var pointsToD = function pointsToD(p) {
          var d = "";
          var i = 0;
          var firstPoint = void 0;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (
              var _iterator = p[Symbol.iterator](), _step;
              !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
              _iteratorNormalCompletion = true
            ) {
              var point = _step.value;
              var _point$curve = point.curve,
                curve = _point$curve === undefined ? false : _point$curve,
                moveTo = point.moveTo,
                x = point.x,
                y = point.y;

              var isFirstPoint = i === 0 || moveTo;
              var isLastPoint = i === p.length - 1 || p[i + 1].moveTo;
              var prevPoint = i === 0 ? null : p[i - 1];

              if (isFirstPoint) {
                firstPoint = point;

                if (!isLastPoint) {
                  d += "M" + x + "," + y;
                }
              } else if (curve) {
                switch (curve.type) {
                  case "arc":
                    var _point$curve2 = point.curve,
                      _point$curve2$largeAr = _point$curve2.largeArcFlag,
                      largeArcFlag = _point$curve2$largeAr === undefined ? 0 : _point$curve2$largeAr,
                      rx = _point$curve2.rx,
                      ry = _point$curve2.ry,
                      _point$curve2$sweepFl = _point$curve2.sweepFlag,
                      sweepFlag = _point$curve2$sweepFl === undefined ? 0 : _point$curve2$sweepFl,
                      _point$curve2$xAxisRo = _point$curve2.xAxisRotation,
                      xAxisRotation = _point$curve2$xAxisRo === undefined ? 0 : _point$curve2$xAxisRo;

                    d += "A" + rx + "," + ry + "," + xAxisRotation + "," + largeArcFlag + "," + sweepFlag + "," + x + "," + y;
                    break;
                  case "cubic":
                    var _point$curve3 = point.curve,
                      cx1 = _point$curve3.x1,
                      cy1 = _point$curve3.y1,
                      cx2 = _point$curve3.x2,
                      cy2 = _point$curve3.y2;

                    d += "C" + cx1 + "," + cy1 + "," + cx2 + "," + cy2 + "," + x + "," + y;
                    break;
                  case "quadratic":
                    var _point$curve4 = point.curve,
                      qx1 = _point$curve4.x1,
                      qy1 = _point$curve4.y1;

                    d += "Q" + qx1 + "," + qy1 + "," + x + "," + y;
                    break;
                }

                if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
                  d += "Z";
                }
              } else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
                d += "Z";
              } else if (x !== prevPoint.x && y !== prevPoint.y) {
                d += "L" + x + "," + y;
              } else if (x !== prevPoint.x) {
                d += "H" + x;
              } else if (y !== prevPoint.y) {
                d += "V" + y;
              }

              i++;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return d;
        };

        var toPath = function toPath(s) {
          var isPoints = Array.isArray(s);
          var isGroup = isPoints ? Array.isArray(s[0]) : s.type === "g";
          var points = isPoints
            ? s
            : isGroup
              ? s.shapes.map(function (shp) {
                  return (0, _toPoints2.default)(shp);
                })
              : (0, _toPoints2.default)(s);

          if (isGroup) {
            return points.map(function (p) {
              return pointsToD(p);
            });
          }

          return pointsToD(points);
        };

        exports.default = toPath;
      },
      { "./toPoints": 18 },
    ],
    18: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _extends =
          Object.assign ||
          function (target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }
            return target;
          };

        function _objectWithoutProperties(obj, keys) {
          var target = {};
          for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
          }
          return target;
        }

        var toPoints = function toPoints(_ref) {
          var type = _ref.type,
            props = _objectWithoutProperties(_ref, ["type"]);

          switch (type) {
            case "circle":
              return getPointsFromCircle(props);
            case "ellipse":
              return getPointsFromEllipse(props);
            case "line":
              return getPointsFromLine(props);
            case "path":
              return getPointsFromPath(props);
            case "polygon":
              return getPointsFromPolygon(props);
            case "polyline":
              return getPointsFromPolyline(props);
            case "rect":
              return getPointsFromRect(props);
            case "g":
              return getPointsFromG(props);
            default:
              throw new Error("Not a valid shape type");
          }
        };

        var getPointsFromCircle = function getPointsFromCircle(_ref2) {
          var cx = _ref2.cx,
            cy = _ref2.cy,
            r = _ref2.r;

          return [
            { x: cx, y: cy - r, moveTo: true },
            { x: cx, y: cy + r, curve: { type: "arc", rx: r, ry: r, sweepFlag: 1 } },
            { x: cx, y: cy - r, curve: { type: "arc", rx: r, ry: r, sweepFlag: 1 } },
          ];
        };

        var getPointsFromEllipse = function getPointsFromEllipse(_ref3) {
          var cx = _ref3.cx,
            cy = _ref3.cy,
            rx = _ref3.rx,
            ry = _ref3.ry;

          return [
            { x: cx, y: cy - ry, moveTo: true },
            { x: cx, y: cy + ry, curve: { type: "arc", rx: rx, ry: ry, sweepFlag: 1 } },
            { x: cx, y: cy - ry, curve: { type: "arc", rx: rx, ry: ry, sweepFlag: 1 } },
          ];
        };

        var getPointsFromLine = function getPointsFromLine(_ref4) {
          var x1 = _ref4.x1,
            x2 = _ref4.x2,
            y1 = _ref4.y1,
            y2 = _ref4.y2;

          return [
            { x: x1, y: y1, moveTo: true },
            { x: x2, y: y2 },
          ];
        };

        var validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g;

        var commandLengths = {
          A: 7,
          C: 6,
          H: 1,
          L: 2,
          M: 2,
          Q: 4,
          S: 4,
          T: 2,
          V: 1,
          Z: 0,
        };

        var relativeCommands = ["a", "c", "h", "l", "m", "q", "s", "t", "v"];

        var isRelative = function isRelative(command) {
          return relativeCommands.indexOf(command) !== -1;
        };

        var optionalArcKeys = ["xAxisRotation", "largeArcFlag", "sweepFlag"];

        var getCommands = function getCommands(d) {
          return d.match(validCommands);
        };

        var getParams = function getParams(d) {
          return d
            .split(validCommands)
            .map(function (v) {
              return v.replace(/[0-9]+-/g, function (m) {
                return m.slice(0, -1) + " -";
              });
            })
            .map(function (v) {
              return v.replace(/\.[0-9]+/g, function (m) {
                return m + " ";
              });
            })
            .map(function (v) {
              return v.trim();
            })
            .filter(function (v) {
              return v.length > 0;
            })
            .map(function (v) {
              return v
                .split(/[ ,]+/)
                .map(parseFloat)
                .filter(function (n) {
                  return !isNaN(n);
                });
            });
        };

        var getPointsFromPath = function getPointsFromPath(_ref5) {
          var d = _ref5.d;

          var commands = getCommands(d);
          var params = getParams(d);

          var points = [];

          var moveTo = void 0;

          for (var i = 0, l = commands.length; i < l; i++) {
            var command = commands[i];
            var upperCaseCommand = command.toUpperCase();
            var commandLength = commandLengths[upperCaseCommand];
            var relative = isRelative(command);

            if (commandLength > 0) {
              var commandParams = params.shift();
              var iterations = commandParams.length / commandLength;

              for (var j = 0; j < iterations; j++) {
                var prevPoint = points[points.length - 1] || { x: 0, y: 0 };

                switch (upperCaseCommand) {
                  case "M":
                    var x = (relative ? prevPoint.x : 0) + commandParams.shift();
                    var y = (relative ? prevPoint.y : 0) + commandParams.shift();

                    if (j === 0) {
                      moveTo = { x: x, y: y };
                      points.push({ x: x, y: y, moveTo: true });
                    } else {
                      points.push({ x: x, y: y });
                    }

                    break;

                  case "L":
                    points.push({
                      x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                      y: (relative ? prevPoint.y : 0) + commandParams.shift(),
                    });

                    break;

                  case "H":
                    points.push({
                      x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                      y: prevPoint.y,
                    });

                    break;

                  case "V":
                    points.push({
                      x: prevPoint.x,
                      y: (relative ? prevPoint.y : 0) + commandParams.shift(),
                    });

                    break;

                  case "A":
                    points.push({
                      curve: {
                        type: "arc",
                        rx: commandParams.shift(),
                        ry: commandParams.shift(),
                        xAxisRotation: commandParams.shift(),
                        largeArcFlag: commandParams.shift(),
                        sweepFlag: commandParams.shift(),
                      },
                      x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                      y: (relative ? prevPoint.y : 0) + commandParams.shift(),
                    });

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                      for (
                        var _iterator = optionalArcKeys[Symbol.iterator](), _step;
                        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                        _iteratorNormalCompletion = true
                      ) {
                        var k = _step.value;

                        if (points[points.length - 1]["curve"][k] === 0) {
                          delete points[points.length - 1]["curve"][k];
                        }
                      }
                    } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                        }
                      } finally {
                        if (_didIteratorError) {
                          throw _iteratorError;
                        }
                      }
                    }

                    break;

                  case "C":
                    points.push({
                      curve: {
                        type: "cubic",
                        x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                        y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                        x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                        y2: (relative ? prevPoint.y : 0) + commandParams.shift(),
                      },
                      x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                      y: (relative ? prevPoint.y : 0) + commandParams.shift(),
                    });

                    break;

                  case "S":
                    var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift();
                    var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift();
                    var sx = (relative ? prevPoint.x : 0) + commandParams.shift();
                    var sy = (relative ? prevPoint.y : 0) + commandParams.shift();

                    var diff = {};

                    var sx1 = void 0;
                    var sy1 = void 0;

                    if (prevPoint.curve && prevPoint.curve.type === "cubic") {
                      diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2);
                      diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2);
                      sx1 = prevPoint.x < prevPoint.curve.x2 ? prevPoint.x - diff.x : prevPoint.x + diff.x;
                      sy1 = prevPoint.y < prevPoint.curve.y2 ? prevPoint.y - diff.y : prevPoint.y + diff.y;
                    } else {
                      diff.x = Math.abs(sx - sx2);
                      diff.y = Math.abs(sy - sy2);
                      sx1 = prevPoint.x;
                      sy1 = prevPoint.y;
                    }

                    points.push({ curve: { type: "cubic", x1: sx1, y1: sy1, x2: sx2, y2: sy2 }, x: sx, y: sy });

                    break;

                  case "Q":
                    points.push({
                      curve: {
                        type: "quadratic",
                        x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                        y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                      },
                      x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                      y: (relative ? prevPoint.y : 0) + commandParams.shift(),
                    });

                    break;

                  case "T":
                    var tx = (relative ? prevPoint.x : 0) + commandParams.shift();
                    var ty = (relative ? prevPoint.y : 0) + commandParams.shift();

                    var tx1 = void 0;
                    var ty1 = void 0;

                    if (prevPoint.curve && prevPoint.curve.type === "quadratic") {
                      var _diff = {
                        x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                        y: Math.abs(prevPoint.y - prevPoint.curve.y1),
                      };

                      tx1 = prevPoint.x < prevPoint.curve.x1 ? prevPoint.x - _diff.x : prevPoint.x + _diff.x;
                      ty1 = prevPoint.y < prevPoint.curve.y1 ? prevPoint.y - _diff.y : prevPoint.y + _diff.y;
                    } else {
                      tx1 = prevPoint.x;
                      ty1 = prevPoint.y;
                    }

                    points.push({ curve: { type: "quadratic", x1: tx1, y1: ty1 }, x: tx, y: ty });

                    break;
                }
              }
            } else {
              var _prevPoint = points[points.length - 1] || { x: 0, y: 0 };

              if (_prevPoint.x !== moveTo.x || _prevPoint.y !== moveTo.y) {
                points.push({ x: moveTo.x, y: moveTo.y });
              }
            }
          }

          return points;
        };

        var getPointsFromPolygon = function getPointsFromPolygon(_ref6) {
          var points = _ref6.points;

          return getPointsFromPoints({ closed: true, points: points });
        };

        var getPointsFromPolyline = function getPointsFromPolyline(_ref7) {
          var points = _ref7.points;

          return getPointsFromPoints({ closed: false, points: points });
        };

        var getPointsFromPoints = function getPointsFromPoints(_ref8) {
          var closed = _ref8.closed,
            points = _ref8.points;

          var numbers = points.split(/[\s,]+/).map(function (n) {
            return parseFloat(n);
          });

          var p = numbers.reduce(function (arr, point, i) {
            if (i % 2 === 0) {
              arr.push({ x: point });
            } else {
              arr[(i - 1) / 2].y = point;
            }

            return arr;
          }, []);

          if (closed) {
            p.push(_extends({}, p[0]));
          }

          p[0].moveTo = true;

          return p;
        };

        var getPointsFromRect = function getPointsFromRect(_ref9) {
          var height = _ref9.height,
            rx = _ref9.rx,
            ry = _ref9.ry,
            width = _ref9.width,
            x = _ref9.x,
            y = _ref9.y;

          if (rx || ry) {
            return getPointsFromRectWithCornerRadius({
              height: height,
              rx: rx || ry,
              ry: ry || rx,
              width: width,
              x: x,
              y: y,
            });
          }

          return getPointsFromBasicRect({ height: height, width: width, x: x, y: y });
        };

        var getPointsFromBasicRect = function getPointsFromBasicRect(_ref10) {
          var height = _ref10.height,
            width = _ref10.width,
            x = _ref10.x,
            y = _ref10.y;

          return [
            { x: x, y: y, moveTo: true },
            { x: x + width, y: y },
            { x: x + width, y: y + height },
            { x: x, y: y + height },
            { x: x, y: y },
          ];
        };

        var getPointsFromRectWithCornerRadius = function getPointsFromRectWithCornerRadius(_ref11) {
          var height = _ref11.height,
            rx = _ref11.rx,
            ry = _ref11.ry,
            width = _ref11.width,
            x = _ref11.x,
            y = _ref11.y;

          var curve = { type: "arc", rx: rx, ry: ry, sweepFlag: 1 };

          return [
            { x: x + rx, y: y, moveTo: true },
            { x: x + width - rx, y: y },
            { x: x + width, y: y + ry, curve: curve },
            { x: x + width, y: y + height - ry },
            { x: x + width - rx, y: y + height, curve: curve },
            { x: x + rx, y: y + height },
            { x: x, y: y + height - ry, curve: curve },
            { x: x, y: y + ry },
            { x: x + rx, y: y, curve: curve },
          ];
        };

        var getPointsFromG = function getPointsFromG(_ref12) {
          var shapes = _ref12.shapes;
          return shapes.map(function (s) {
            return toPoints(s);
          });
        };

        exports.default = toPoints;
      },
      {},
    ],
    19: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _typeof =
          typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
            ? function (obj) {
                return typeof obj;
              }
            : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
              };

        var getErrors = function getErrors(shape) {
          var rules = getRules(shape);
          var errors = [];

          rules.map(function (_ref) {
            var match = _ref.match,
              prop = _ref.prop,
              required = _ref.required,
              type = _ref.type;

            if (typeof shape[prop] === "undefined") {
              if (required) {
                errors.push(prop + " prop is required" + (prop === "type" ? "" : " on a " + shape.type));
              }
            } else {
              if (typeof type !== "undefined") {
                if (type === "array") {
                  if (!Array.isArray(shape[prop])) {
                    errors.push(prop + " prop must be of type array");
                  }
                } else if (_typeof(shape[prop]) !== type) {
                  // eslint-disable-line valid-typeof
                  errors.push(prop + " prop must be of type " + type);
                }
              }

              if (Array.isArray(match)) {
                if (match.indexOf(shape[prop]) === -1) {
                  errors.push(prop + " prop must be one of " + match.join(", "));
                }
              }
            }
          });

          if (shape.type === "g" && Array.isArray(shape.shapes)) {
            var childErrors = shape.shapes.map(function (s) {
              return getErrors(s);
            });
            return [].concat.apply(errors, childErrors);
          }

          return errors;
        };

        var getRules = function getRules(shape) {
          var rules = [
            {
              match: ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect", "g"],
              prop: "type",
              required: true,
              type: "string",
            },
          ];

          switch (shape.type) {
            case "circle":
              rules.push({ prop: "cx", required: true, type: "number" });
              rules.push({ prop: "cy", required: true, type: "number" });
              rules.push({ prop: "r", required: true, type: "number" });
              break;

            case "ellipse":
              rules.push({ prop: "cx", required: true, type: "number" });
              rules.push({ prop: "cy", required: true, type: "number" });
              rules.push({ prop: "rx", required: true, type: "number" });
              rules.push({ prop: "ry", required: true, type: "number" });
              break;

            case "line":
              rules.push({ prop: "x1", required: true, type: "number" });
              rules.push({ prop: "x2", required: true, type: "number" });
              rules.push({ prop: "y1", required: true, type: "number" });
              rules.push({ prop: "y2", required: true, type: "number" });
              break;

            case "path":
              rules.push({ prop: "d", required: true, type: "string" });
              break;

            case "polygon":
            case "polyline":
              rules.push({ prop: "points", required: true, type: "string" });
              break;

            case "rect":
              rules.push({ prop: "height", required: true, type: "number" });
              rules.push({ prop: "rx", type: "number" });
              rules.push({ prop: "ry", type: "number" });
              rules.push({ prop: "width", required: true, type: "number" });
              rules.push({ prop: "x", required: true, type: "number" });
              rules.push({ prop: "y", required: true, type: "number" });
              break;

            case "g":
              rules.push({ prop: "shapes", required: true, type: "array" });
              break;
          }

          return rules;
        };

        var valid = function valid(shape) {
          var errors = getErrors(shape);

          return {
            errors: errors,
            valid: errors.length === 0,
          };
        };

        exports.default = valid;
      },
      {},
    ],
    20: [
      function (require, module, exports) {
        "use strict";

        module.exports = TinyQueue;
        module.exports.default = TinyQueue;

        function TinyQueue(data, compare) {
          if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

          this.data = data || [];
          this.length = this.data.length;
          this.compare = compare || defaultCompare;

          if (this.length > 0) {
            for (var i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
          }
        }

        function defaultCompare(a, b) {
          return a < b ? -1 : a > b ? 1 : 0;
        }

        TinyQueue.prototype = {
          push: function (item) {
            this.data.push(item);
            this.length++;
            this._up(this.length - 1);
          },

          pop: function () {
            if (this.length === 0) return undefined;

            var top = this.data[0];
            this.length--;

            if (this.length > 0) {
              this.data[0] = this.data[this.length];
              this._down(0);
            }
            this.data.pop();

            return top;
          },

          peek: function () {
            return this.data[0];
          },

          _up: function (pos) {
            var data = this.data;
            var compare = this.compare;
            var item = data[pos];

            while (pos > 0) {
              var parent = (pos - 1) >> 1;
              var current = data[parent];
              if (compare(item, current) >= 0) break;
              data[pos] = current;
              pos = parent;
            }

            data[pos] = item;
          },

          _down: function (pos) {
            var data = this.data;
            var compare = this.compare;
            var halfLength = this.length >> 1;
            var item = data[pos];

            while (pos < halfLength) {
              var left = (pos << 1) + 1;
              var right = left + 1;
              var best = data[left];

              if (right < this.length && compare(data[right], best) < 0) {
                left = right;
                best = data[right];
              }
              if (compare(best, item) >= 0) break;

              data[pos] = best;
              pos = left;
            }

            data[pos] = item;
          },
        };
      },
      {},
    ],
    21: [
      function (require, module, exports) {
        (function inject(clean, precision, undef) {
          var isArray = function (a) {
            return Object.prototype.toString.call(a) === "[object Array]";
          };

          var defined = function (a) {
            return a !== undef;
          };

          function Vec2(x, y) {
            if (!(this instanceof Vec2)) {
              return new Vec2(x, y);
            }

            if (isArray(x)) {
              y = x[1];
              x = x[0];
            } else if ("object" === typeof x && x) {
              y = x.y;
              x = x.x;
            }

            this.x = Vec2.clean(x || 0);
            this.y = Vec2.clean(y || 0);
          }

          Vec2.prototype = {
            change: function (fn) {
              if (typeof fn === "function") {
                if (this.observers) {
                  this.observers.push(fn);
                } else {
                  this.observers = [fn];
                }
              } else if (this.observers && this.observers.length) {
                for (var i = this.observers.length - 1; i >= 0; i--) {
                  this.observers[i](this, fn);
                }
              }

              return this;
            },

            ignore: function (fn) {
              if (this.observers) {
                if (!fn) {
                  this.observers = [];
                } else {
                  var o = this.observers,
                    l = o.length;
                  while (l--) {
                    o[l] === fn && o.splice(l, 1);
                  }
                }
              }
              return this;
            },

            // set x and y
            set: function (x, y, notify) {
              if ("number" != typeof x) {
                notify = y;
                y = x.y;
                x = x.x;
              }

              if (this.x === x && this.y === y) {
                return this;
              }

              var orig = null;
              if (notify !== false && this.observers && this.observers.length) {
                orig = this.clone();
              }

              this.x = Vec2.clean(x);
              this.y = Vec2.clean(y);

              if (notify !== false) {
                return this.change(orig);
              }
            },

            // reset x and y to zero
            zero: function () {
              return this.set(0, 0);
            },

            // return a new vector with the same component values
            // as this one
            clone: function () {
              return new this.constructor(this.x, this.y);
            },

            // negate the values of this vector
            negate: function (returnNew) {
              if (returnNew) {
                return new this.constructor(-this.x, -this.y);
              } else {
                return this.set(-this.x, -this.y);
              }
            },

            // Add the incoming `vec2` vector to this vector
            add: function (x, y, returnNew) {
              if (typeof x != "number") {
                returnNew = y;
                if (isArray(x)) {
                  y = x[1];
                  x = x[0];
                } else {
                  y = x.y;
                  x = x.x;
                }
              }

              x += this.x;
              y += this.y;

              if (!returnNew) {
                return this.set(x, y);
              } else {
                // Return a new vector if `returnNew` is truthy
                return new this.constructor(x, y);
              }
            },

            // Subtract the incoming `vec2` from this vector
            subtract: function (x, y, returnNew) {
              if (typeof x != "number") {
                returnNew = y;
                if (isArray(x)) {
                  y = x[1];
                  x = x[0];
                } else {
                  y = x.y;
                  x = x.x;
                }
              }

              x = this.x - x;
              y = this.y - y;

              if (!returnNew) {
                return this.set(x, y);
              } else {
                // Return a new vector if `returnNew` is truthy
                return new this.constructor(x, y);
              }
            },

            // Multiply this vector by the incoming `vec2`
            multiply: function (x, y, returnNew) {
              if (typeof x != "number") {
                returnNew = y;
                if (isArray(x)) {
                  y = x[1];
                  x = x[0];
                } else {
                  y = x.y;
                  x = x.x;
                }
              } else if (typeof y != "number") {
                returnNew = y;
                y = x;
              }

              x *= this.x;
              y *= this.y;

              if (!returnNew) {
                return this.set(x, y);
              } else {
                return new this.constructor(x, y);
              }
            },

            // Rotate this vector. Accepts a `Rotation` or angle in radians.
            //
            // Passing a truthy `inverse` will cause the rotation to
            // be reversed.
            //
            // If `returnNew` is truthy, a new
            // `Vec2` will be created with the values resulting from
            // the rotation. Otherwise the rotation will be applied
            // to this vector directly, and this vector will be returned.
            rotate: function (r, inverse, returnNew) {
              var x = this.x,
                y = this.y,
                cos = Math.cos(r),
                sin = Math.sin(r),
                rx,
                ry;

              inverse = inverse ? -1 : 1;

              rx = cos * x - inverse * sin * y;
              ry = inverse * sin * x + cos * y;

              if (returnNew) {
                return new this.constructor(rx, ry);
              } else {
                return this.set(rx, ry);
              }
            },

            // Calculate the length of this vector
            length: function () {
              var x = this.x,
                y = this.y;
              return Math.sqrt(x * x + y * y);
            },

            // Get the length squared. For performance, use this instead of `Vec2#length` (if possible).
            lengthSquared: function () {
              var x = this.x,
                y = this.y;
              return x * x + y * y;
            },

            // Return the distance betwen this `Vec2` and the incoming vec2 vector
            // and return a scalar
            distance: function (vec2) {
              var x = this.x - vec2.x;
              var y = this.y - vec2.y;
              return Math.sqrt(x * x + y * y);
            },

            // Given Array of Vec2, find closest to this Vec2.
            nearest: function (others) {
              var shortestDistance = Number.MAX_VALUE,
                nearest = null,
                currentDistance;

              for (var i = others.length - 1; i >= 0; i--) {
                currentDistance = this.distance(others[i]);
                if (currentDistance <= shortestDistance) {
                  shortestDistance = currentDistance;
                  nearest = others[i];
                }
              }

              return nearest;
            },

            // Convert this vector into a unit vector.
            // Returns the length.
            normalize: function (returnNew) {
              var length = this.length();

              // Collect a ratio to shrink the x and y coords
              var invertedLength = length < Number.MIN_VALUE ? 0 : 1 / length;

              if (!returnNew) {
                // Convert the coords to be greater than zero
                // but smaller than or equal to 1.0
                return this.set(this.x * invertedLength, this.y * invertedLength);
              } else {
                return new this.constructor(this.x * invertedLength, this.y * invertedLength);
              }
            },

            // Determine if another `Vec2`'s components match this one's
            // also accepts 2 scalars
            equal: function (v, w) {
              if (typeof v != "number") {
                if (isArray(v)) {
                  w = v[1];
                  v = v[0];
                } else {
                  w = v.y;
                  v = v.x;
                }
              }

              return Vec2.clean(v) === this.x && Vec2.clean(w) === this.y;
            },

            // Return a new `Vec2` that contains the absolute value of
            // each of this vector's parts
            abs: function (returnNew) {
              var x = Math.abs(this.x),
                y = Math.abs(this.y);

              if (returnNew) {
                return new this.constructor(x, y);
              } else {
                return this.set(x, y);
              }
            },

            // Return a new `Vec2` consisting of the smallest values
            // from this vector and the incoming
            //
            // When returnNew is truthy, a new `Vec2` will be returned
            // otherwise the minimum values in either this or `v` will
            // be applied to this vector.
            min: function (v, returnNew) {
              var tx = this.x,
                ty = this.y,
                vx = v.x,
                vy = v.y,
                x = tx < vx ? tx : vx,
                y = ty < vy ? ty : vy;

              if (returnNew) {
                return new this.constructor(x, y);
              } else {
                return this.set(x, y);
              }
            },

            // Return a new `Vec2` consisting of the largest values
            // from this vector and the incoming
            //
            // When returnNew is truthy, a new `Vec2` will be returned
            // otherwise the minimum values in either this or `v` will
            // be applied to this vector.
            max: function (v, returnNew) {
              var tx = this.x,
                ty = this.y,
                vx = v.x,
                vy = v.y,
                x = tx > vx ? tx : vx,
                y = ty > vy ? ty : vy;

              if (returnNew) {
                return new this.constructor(x, y);
              } else {
                return this.set(x, y);
              }
            },

            // Clamp values into a range.
            // If this vector's values are lower than the `low`'s
            // values, then raise them.  If they are higher than
            // `high`'s then lower them.
            //
            // Passing returnNew as true will cause a new Vec2 to be
            // returned.  Otherwise, this vector's values will be clamped
            clamp: function (low, high, returnNew) {
              var ret = this.min(high, true).max(low);
              if (returnNew) {
                return ret;
              } else {
                return this.set(ret.x, ret.y);
              }
            },

            // Perform linear interpolation between two vectors
            // amount is a decimal between 0 and 1
            lerp: function (vec, amount, returnNew) {
              return this.add(vec.subtract(this, true).multiply(amount), returnNew);
            },

            // Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
            skew: function (returnNew) {
              if (!returnNew) {
                return this.set(-this.y, this.x);
              } else {
                return new this.constructor(-this.y, this.x);
              }
            },

            // calculate the dot product between
            // this vector and the incoming
            dot: function (b) {
              return Vec2.clean(this.x * b.x + b.y * this.y);
            },

            // calculate the perpendicular dot product between
            // this vector and the incoming
            perpDot: function (b) {
              return Vec2.clean(this.x * b.y - this.y * b.x);
            },

            // Determine the angle between two vec2s
            angleTo: function (vec) {
              return Math.atan2(this.perpDot(vec), this.dot(vec));
            },

            // Divide this vector's components by a scalar
            divide: function (x, y, returnNew) {
              if (typeof x != "number") {
                returnNew = y;
                if (isArray(x)) {
                  y = x[1];
                  x = x[0];
                } else {
                  y = x.y;
                  x = x.x;
                }
              } else if (typeof y != "number") {
                returnNew = y;
                y = x;
              }

              if (x === 0 || y === 0) {
                throw new Error("division by zero");
              }

              if (isNaN(x) || isNaN(y)) {
                throw new Error("NaN detected");
              }

              if (returnNew) {
                return new this.constructor(this.x / x, this.y / y);
              }

              return this.set(this.x / x, this.y / y);
            },

            isPointOnLine: function (start, end) {
              return (start.y - this.y) * (start.x - end.x) === (start.y - end.y) * (start.x - this.x);
            },

            toArray: function () {
              return [this.x, this.y];
            },

            fromArray: function (array) {
              return this.set(array[0], array[1]);
            },
            toJSON: function () {
              return { x: this.x, y: this.y };
            },
            toString: function () {
              return "(" + this.x + ", " + this.y + ")";
            },
            constructor: Vec2,
          };

          Vec2.fromArray = function (array, ctor) {
            return new (ctor || Vec2)(array[0], array[1]);
          };

          // Floating point stability
          Vec2.precision = precision || 8;
          var p = Math.pow(10, Vec2.precision);

          Vec2.clean =
            clean ||
            function (val) {
              if (isNaN(val)) {
                throw new Error("NaN detected");
              }

              if (!isFinite(val)) {
                throw new Error("Infinity detected");
              }

              if (Math.round(val) === val) {
                return val;
              }

              return Math.round(val * p) / p;
            };

          Vec2.inject = inject;

          if (!clean) {
            Vec2.fast = inject(function (k) {
              return k;
            });

            // Expose, but also allow creating a fresh Vec2 subclass.
            if (typeof module !== "undefined" && typeof module.exports == "object") {
              module.exports = Vec2;
            } else {
              window.Vec2 = window.Vec2 || Vec2;
            }
          }
          return Vec2;
        })();
      },
      {},
    ],
  },
  {},
  [9]
);
