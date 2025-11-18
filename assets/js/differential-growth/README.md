# Differential Growth Source Code

This directory contains the actual source code from [jasonwebb/2d-differential-growth-experiments](https://github.com/jasonwebb/2d-differential-growth-experiments).

## Building

The source code uses CommonJS modules and needs to be bundled for browser use. To build:

1. Install browserify globally: `npm install -g browserify`
2. Navigate to this directory: `cd assets/js/differential-growth`
3. Install dependencies: `npm install vec2@1.6.0 rbush@3.0.1 rbush-knn@3.0.0 svg-points@6.0.1 file-saver@2.0.5 point-in-polygon@1.0.1`
4. Bundle: `browserify entry.js -o ../differential-growth-bundled.js`

Or use the build script from the root: `build-differential-growth.bat`

## Files

- `Node.js` - Node class (extends Vec2)
- `Path.js` - Path class managing nodes
- `World.js` - World class managing paths
- `Bounds.js` - Bounds class for constraining paths
- `Defaults.js` - Default settings
- `Settings.js` - Custom settings for this implementation
- `entry.js` - Entry point that initializes the p5.js sketch

## Usage

After building, update `_includes/scripts.liquid` to load `differential-growth-bundled.js` instead of the simplified bundle.
