// Simple CommonJS module loader for differential growth
// This allows the original source code to work in the browser

(function () {
  const modules = {};
  const cache = {};

  // Simple require implementation
  window.require = function (modulePath) {
    if (cache[modulePath]) {
      return cache[modulePath];
    }

    // Handle node_modules dependencies
    if (modulePath.includes("node_modules")) {
      const moduleName = modulePath.split("/").pop();

      // Map to global variables set by CDN scripts
      const moduleMap = {
        vec2: window.Vec2 || window.vec2,
        rbush: window.rbush,
        "rbush-knn": window.knn || window.rbushKnn,
        "svg-points": window.svgPoints,
        "file-saver": { saveAs: window.saveAs },
        "point-in-polygon": window.inside || window.pointInPolygon,
      };

      if (moduleMap[moduleName]) {
        cache[modulePath] = moduleMap[moduleName];
        return moduleMap[moduleName];
      }
    }

    // Handle local modules
    if (modules[modulePath]) {
      const module = { exports: {} };
      modules[modulePath](module, module.exports, window.require);
      cache[modulePath] = module.exports;
      return module.exports;
    }

    throw new Error(`Module not found: ${modulePath}`);
  };

  // Register local modules
  window.defineModule = function (path, factory) {
    modules[path] = factory;
  };

  // Load local modules
  function loadModule(path, factory) {
    modules[path] = factory;
  }

  // Export for use
  window.diffGrowthModules = { loadModule, require: window.require };
})();
