/** @module Defaults */

module.exports = {
  /**
   * Minimum distance between nodes. Used in attraction, pruning, and injection
   * @type {number}
   */
  MinDistance: 20,

  /**
   * Maximum distance between nodes before they are split
   * @type {number}
   */
  MaxDistance: 30,

  /**
   * Radius to search for nearby nodes for repulsion force
   * @type {number}
   */
  RepulsionRadius: 20,

  /**
   * Maximum velocity at which a node can move per frame
   * @type {number}
   */
  MaxVelocity: 0.1,

  /**
   * Maximum attraction force between connected nodes
   * @type {number}
   */
  AttractionForce: 0.001,

  /**
   * Maximum repulsion force between nearby nodes
   * @type {number}
   */
  RepulsionForce: 500,

  /**
   * Maximum alignment force between connected nodes
   * @type {number}
   */
  AlignmentForce: 0.001,

  /**
   * Attraction force weight for connected neighbors (n=±1)
   * @type {number}
   */
  AttractionForceConnectedWeight: 1.0,

  /**
   * Attraction force weight for near neighbors (n=±2 to ±10)
   * @type {number}
   */
  AttractionForceNearWeight: 0.5,

  /**
   * Attraction force weight for far neighbors (n=±11+)
   * @type {number}
   */
  AttractionForceFarWeight: 0.1,

  /**
   * Repulsion force weight for connected neighbors (n=±1) - LOW to let attraction handle these
   * @type {number}
   */
  RepulsionForceConnectedWeight: 0.1,

  /**
   * Repulsion force weight for non-connected near nodes (n=±2-10) - HIGH to prevent overlaps
   * @type {number}
   */
  RepulsionForceNonConnectedNearWeight: 1.5,

  /**
   * Repulsion force weight for non-connected far nodes (n=±11+) - HIGH to prevent overlaps
   * @type {number}
   */
  RepulsionForceNonConnectedFarWeight: 1.2,

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
