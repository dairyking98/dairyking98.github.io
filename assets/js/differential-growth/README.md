# Differential Growth Source Code

This directory contains the source code for an interactive 2D differential growth visualization, based on [jasonwebb/2d-differential-growth-experiments](https://github.com/jasonwebb/2d-differential-growth-experiments).

## Overview

Differential growth is a natural process that produces interesting undulating forms out of over-constrained chains of particles using simple, configurable rules. This implementation simulates how paths grow and evolve based on forces between connected nodes.

## How It Works

The simulation applies three main forces to each node:

1. **Attraction Force**: Pulls nodes toward their immediately connected neighbors (n=±1) along the path to maintain path continuity
2. **Repulsion Force**: Pushes nodes away from all nearby nodes within a spatial radius to prevent overlapping
3. **Alignment Force**: Aligns nodes with their connected neighbors to reduce curvature and create smoother curves

Nodes are automatically split when edges become too long, and merged when they become too close, maintaining an optimal density along the path.

## Building

The source code uses CommonJS modules and needs to be bundled for browser use.

### Quick Build

From the project root, run:
```bash
build-differential-growth.bat
```

Or use Node.js directly:
```bash
node build-bundle.js
```

### Manual Build

1. Install browserify globally: `npm install -g browserify`
2. Navigate to this directory: `cd assets/js/differential-growth`
3. Install dependencies: `npm install vec2@1.6.0 rbush@3.0.1 rbush-knn@3.0.0 svg-points@6.0.1 file-saver@2.0.5 point-in-polygon@1.0.1`
4. Bundle: `browserify entry.js -o ../differential-growth-bundle.js`

The bundled output will be `assets/js/differential-growth-bundle.js`

## Files

- `Node.js` - Node class (extends Vec2), represents a single point in a path
- `Path.js` - Path class managing an ordered sequence of nodes
- `World.js` - World class managing multiple paths and global settings
- `Bounds.js` - Bounds class for constraining paths within geometric boundaries
- `Defaults.js` - Default configuration values (documentation defaults)
- `Settings.js` - Working default values used in the application
- `ParametersPanel.js` - UI panel for adjusting simulation parameters
- `entry.js` - Entry point that initializes the p5.js sketch and connects everything together
- `SVGLoader.js` - Handles loading custom SVG files

## Configuration Parameters

All parameters can be adjusted via the UI parameters panel. Default values are in `Settings.js`:

### Distance Parameters
- **MinDistance** (default: 2): Minimum allowed distance between adjacent nodes
- **MaxDistance** (default: 5): Maximum distance before a new node is inserted
- **RepulsionRadius** (default: 15): Spatial radius (in pixels) for repulsion detection

### Force Parameters
- **AttractionForce** (default: 0.2): Strength of attraction to connected neighbors
- **RepulsionForce** (default: 0.6): Strength of repulsion from nearby nodes
- **AlignmentForce** (default: 0.55): Strength of alignment with connected neighbors

### Other Parameters
- **MaxVelocity** (default: 0.1): Maximum movement speed per frame
- **NodeInjectionInterval** (default: 100ms): Interval between automatic node injection
- **UseBrownianMotion** (default: true): Enable random jittering for organic variation
- **BrownianMotionRange** (default: 0.01): Amount of random displacement
- **TimeScale** (default: 1): Simulation speed multiplier (1x = normal, higher = faster)
- **DrawHistory** (default: false): Show previous growth stages like tree rings
- **HistoryCaptureInterval** (default: 1000ms): Time between history snapshots
- **MaxHistorySize** (default: 10): Maximum number of history snapshots to keep

## Customizations Made

This implementation includes the following customizations beyond the original:

- **Time Scale Control**: Added `TimeScale` parameter to control simulation speed
- **Local Storage**: Time scale preference is saved to localStorage
- **Enhanced UI**: Improved parameter descriptions and organization in the UI
- **Dark Mode Support**: Automatic adaptation to site's dark/light theme

## Usage

The bundled file is automatically loaded when visiting the `/differential-growth/` page. The interactive interface allows users to:

- Draw freehand paths, rectangles, or circles
- Import custom SVG files
- Adjust all simulation parameters in real-time
- Export results as SVG files
- Toggle various visual effects and debug modes

## Implementation Notes

- Forces are applied to **connected neighbors only** (n=±1) for attraction and alignment
- Repulsion applies to **all nodes within spatial radius** regardless of path distance
- Path distance (n) refers to the **number of nodes along the path**, not pixel distance
- The simulation uses an R-tree spatial index for efficient neighbor queries
- All force calculations use linear interpolation (lerp) for smooth movement
