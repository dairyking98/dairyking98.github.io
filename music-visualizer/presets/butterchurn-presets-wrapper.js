// Local presets wrapper
// Loads presets from JSON files matching butterchurn-presets.json* pattern
// Version: 2.0 - Multi-file loading support

let presetsCache = null;

export default {
    async getPresets() {
        if (presetsCache) {
            return presetsCache;
        }

        try {
            // Load from all butterchurn-presets.json* files
            // Add cache-busting query parameter to ensure fresh load
            const cacheBuster = '?v=' + Date.now();
            const presetFiles = [
                '/music-visualizer/presets/butterchurn-presets.json'
            ];
            
            console.log('[Preset Loader] Loading presets from JSON files...');
            const allPresets = {};
            
            for (const filePath of presetFiles) {
                try {
                    const response = await fetch(filePath + cacheBuster);
                    
                    if (!response.ok) {
                        console.warn(`[Preset Loader] Could not load ${filePath}: HTTP ${response.status}`);
                        continue;
                    }
                    
                    const presets = await response.json();
                    
                    if (presets && typeof presets === 'object') {
                        const presetCount = Object.keys(presets).length;
                        if (presetCount > 0) {
                            // Merge presets (later files override earlier ones if keys conflict)
                            Object.assign(allPresets, presets);
                            console.log(`[Preset Loader] Loaded ${presetCount} presets from ${filePath}`);
                            console.log(`[Preset Loader] Sample keys from ${filePath}:`, Object.keys(presets).slice(0, 3));
                        } else {
                            console.log(`[Preset Loader] ${filePath} is empty (0 presets), skipping`);
                        }
                    } else {
                        console.warn(`[Preset Loader] ${filePath} did not return a valid object`);
                    }
                } catch (fileError) {
                    console.warn(`[Preset Loader] Error loading ${filePath}:`, fileError.message);
                    // Continue loading other files even if one fails
                }
            }
            
            if (Object.keys(allPresets).length === 0) {
                throw new Error('No presets loaded from any JSON file');
            }
            
            const presetCount = Object.keys(allPresets).length;
            console.log(`[Preset Loader] Successfully loaded ${presetCount} total presets from all JSON files`);
            console.log('[Preset Loader] All preset names:', Object.keys(allPresets));
            
            presetsCache = allPresets;
            return presetsCache;
        } catch (error) {
            console.error('[Preset Loader] Error loading presets from JSON:', error);
            console.error('[Preset Loader] Error message:', error.message);
            console.error('[Preset Loader] Make sure presets/butterchurn-presets.json* files exist and are accessible');
            throw new Error('Failed to load presets: ' + error.message);
        }
    }
};

