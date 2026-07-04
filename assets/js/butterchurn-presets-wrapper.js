// Source: musicviz2/presets/butterchurn-presets-wrapper.js
// Local presets wrapper
// Loads presets from the JSON file (which was exported from the source repository)
// Modified for Jekyll: loads from /assets/json/butterchurn-presets.json

let presetsCache = null;

export default {
  async getPresets() {
    if (presetsCache) {
      return presetsCache;
    }

    try {
      // Load from JSON file (most reliable for browser)
      // Add cache-busting query parameter to ensure fresh load
      const cacheBuster = "?v=" + Date.now();
      console.log("[Preset Loader] Loading presets from JSON file...");
      const response = await fetch("/assets/json/butterchurn-presets.json" + cacheBuster);

      console.log("[Preset Loader] Response status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const presets = await response.json();
      console.log("[Preset Loader] JSON parsed, checking presets...");

      if (!presets || Object.keys(presets).length === 0) {
        throw new Error("Presets JSON file is empty");
      }

      const presetCount = Object.keys(presets).length;
      console.log(`[Preset Loader] Successfully loaded ${presetCount} presets from JSON file`);
      console.log("[Preset Loader] First few preset names:", Object.keys(presets).slice(0, 5));

      presetsCache = presets;
      return presetsCache;
    } catch (error) {
      console.error("[Preset Loader] Error loading presets from JSON:", error);
      console.error("[Preset Loader] Error message:", error.message);
      console.error("[Preset Loader] Make sure /assets/json/butterchurn-presets.json exists and is accessible");
      throw new Error("Failed to load presets: " + error.message);
    }
  },
};
