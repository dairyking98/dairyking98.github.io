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

    // Attraction force weights
    this.attractionConnectedWeightRange = document.querySelector(".parameters-content #attraction-connected-weight");
    this.attractionConnectedWeightValue = document.querySelector(".parameters-content #attraction-connected-weight + .value");

    this.attractionNearWeightRange = document.querySelector(".parameters-content #attraction-near-weight");
    this.attractionNearWeightValue = document.querySelector(".parameters-content #attraction-near-weight + .value");

    this.attractionFarWeightRange = document.querySelector(".parameters-content #attraction-far-weight");
    this.attractionFarWeightValue = document.querySelector(".parameters-content #attraction-far-weight + .value");

    // Repulsion force weights
    this.repulsionConnectedWeightRange = document.querySelector(".parameters-content #repulsion-connected-weight");
    this.repulsionConnectedWeightValue = document.querySelector(".parameters-content #repulsion-connected-weight + .value");

    this.repulsionNearWeightRange = document.querySelector(".parameters-content #repulsion-near-weight");
    this.repulsionNearWeightValue = document.querySelector(".parameters-content #repulsion-near-weight + .value");

    this.repulsionFarWeightRange = document.querySelector(".parameters-content #repulsion-far-weight");
    this.repulsionFarWeightValue = document.querySelector(".parameters-content #repulsion-far-weight + .value");

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

    // Attraction force weights
    this.attractionConnectedWeightRange.value = this.world.settings.AttractionForceConnectedWeight;
    this.attractionConnectedWeightValue.innerHTML = this.world.settings.AttractionForceConnectedWeight.toFixed(2);

    this.attractionNearWeightRange.value = this.world.settings.AttractionForceNearWeight;
    this.attractionNearWeightValue.innerHTML = this.world.settings.AttractionForceNearWeight.toFixed(2);

    this.attractionFarWeightRange.value = this.world.settings.AttractionForceFarWeight;
    this.attractionFarWeightValue.innerHTML = this.world.settings.AttractionForceFarWeight.toFixed(2);

    // Repulsion force weights
    this.repulsionConnectedWeightRange.value = this.world.settings.RepulsionForceConnectedWeight;
    this.repulsionConnectedWeightValue.innerHTML = this.world.settings.RepulsionForceConnectedWeight.toFixed(2);

    this.repulsionNearWeightRange.value = this.world.settings.RepulsionForceNonConnectedNearWeight;
    this.repulsionNearWeightValue.innerHTML = this.world.settings.RepulsionForceNonConnectedNearWeight.toFixed(2);

    this.repulsionFarWeightRange.value = this.world.settings.RepulsionForceNonConnectedFarWeight;
    this.repulsionFarWeightValue.innerHTML = this.world.settings.RepulsionForceNonConnectedFarWeight.toFixed(2);

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

    this.attractionConnectedWeightRange.addEventListener("input", this.attractionConnectedWeightChangeHandler.bind(this));
    this.attractionNearWeightRange.addEventListener("input", this.attractionNearWeightChangeHandler.bind(this));
    this.attractionFarWeightRange.addEventListener("input", this.attractionFarWeightChangeHandler.bind(this));

    this.repulsionConnectedWeightRange.addEventListener("input", this.repulsionConnectedWeightChangeHandler.bind(this));
    this.repulsionNearWeightRange.addEventListener("input", this.repulsionNearWeightChangeHandler.bind(this));
    this.repulsionFarWeightRange.addEventListener("input", this.repulsionFarWeightChangeHandler.bind(this));

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

  attractionConnectedWeightChangeHandler(e) {
    this.attractionConnectedWeightValue.innerHTML = parseFloat(e.target.value).toFixed(2);
    this.world.setAttractionForceConnectedWeight(parseFloat(e.target.value));
  }
  attractionNearWeightChangeHandler(e) {
    this.attractionNearWeightValue.innerHTML = parseFloat(e.target.value).toFixed(2);
    this.world.setAttractionForceNearWeight(parseFloat(e.target.value));
  }
  attractionFarWeightChangeHandler(e) {
    this.attractionFarWeightValue.innerHTML = parseFloat(e.target.value).toFixed(2);
    this.world.setAttractionForceFarWeight(parseFloat(e.target.value));
  }

  repulsionConnectedWeightChangeHandler(e) {
    this.repulsionConnectedWeightValue.innerHTML = parseFloat(e.target.value).toFixed(2);
    this.world.setRepulsionForceConnectedWeight(parseFloat(e.target.value));
  }
  repulsionNearWeightChangeHandler(e) {
    this.repulsionNearWeightValue.innerHTML = parseFloat(e.target.value).toFixed(2);
    this.world.setRepulsionForceNonConnectedNearWeight(parseFloat(e.target.value));
  }
  repulsionFarWeightChangeHandler(e) {
    this.repulsionFarWeightValue.innerHTML = parseFloat(e.target.value).toFixed(2);
    this.world.setRepulsionForceNonConnectedFarWeight(parseFloat(e.target.value));
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
