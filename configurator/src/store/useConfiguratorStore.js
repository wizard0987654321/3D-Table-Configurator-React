import { create } from 'zustand'

export const useConfiguratorStore = create((set, get) => ({
    // id to identify if we are in editing mode
    editingId: null,

    // 1. State: Colors & Materials
    topColor: '#d4c4a8',
    legColor: '#555555',
    topMaterial: 'wood',
    legMaterial: 'metal',
    topTexture: 'none',

    // 2. State: Dimensions (cm)
    width: 120,
    height: 75,
    depth: 80,

    // 3. State: Plate & Legs
    plateShape: 'rect',
    thicknessCm: 4,
    legType: 'square',

    // State for the Configuration Name
    configName: '', 

    // 4. Action: Update fields
    setField: (key, value) => set({ [key]: value }),

    // 5. Logic: Calculate Price
    getPrice: () => {
        const { width, depth, height, topMaterial, legMaterial, legType, thicknessCm } = get()
        
        let price = 150;
        price *= (width * depth) / (120 * 80);

        if (height > 75) price += 50;
        if (topMaterial === 'glass') price += 80;
        if (topMaterial === 'wood') price += 40;
        if (legMaterial === 'wood') price += 20;
        if (legType === 'uFrame') price += 60;
        if (legType === 'pedestal') price += 50;
        if (thicknessCm === 6) price += 70;
        if (thicknessCm === 3) price -= 20;

        return Math.round(price);
    },

    // 6. Action: Save to Database
    saveConfiguration: async () => {
        const state = get();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Please log in to save your design!");
            return;
        }

        // Construct the flat object exactly matching your Backend destructuring
        const payload = {
            userId: userId,
            configName: state.configName, // Takes the current value from the input field
            topColor: state.topColor,
            legColor: state.legColor,
            topMaterial: state.topMaterial,
            legMaterial: state.legMaterial,
            width: state.width,
            height: state.height,
            depth: state.depth,
            plateShape: state.plateShape,
            thicknessCm: state.thicknessCm,
            legType: state.legType,
            totalPrice: state.getPrice(),
            topTexture: state.topTexture
        };

        try {
            const response = await fetch('http://localhost:3000/api/save-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), 
            });

            if (response.ok) {
                alert(`Saved "${state.configName}" successfully!`);
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.error);
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Could not connect to server.");
        }
    },

loadConfiguration: (config) => {
    set({
        editingId: config.id,
        configName: config.config_name,
        topColor: config.top_color,
        legColor: config.leg_color,
        topMaterial: config.top_material,
        legMaterial: config.leg_material,
        width: config.width,
        height: config.height,
        depth: config.depth,
        plateShape: config.plate_shape,
        thicknessCm: config.thickness_cm,
        legType: config.leg_type,
        topTexture: config.top_texture || 'none',
    });
},

// when user clicks on new design, reset to defaults
resetToDefault: () => {
    set({
        editingId: null,
        configName: '',
        topColor: '#6c8bff',
        legColor: '#555555',
        width: 120,
        height: 75,
        depth: 80,
        plateShape: 'rect',
        thicknessCm: 4,
        legType: 'square',
        topTexture: 'none'
    });
},

updateConfiguration: async () => {
        const state = get();
        const payload = {
            configName: state.configName,
            topColor: state.topColor,
            legColor: state.legColor,
            topMaterial: state.topMaterial,
            legMaterial: state.legMaterial,
            width: state.width,
            height: state.height,
            depth: state.depth,
            plateShape: state.plateShape,
            thicknessCm: state.thicknessCm,
            legType: state.legType,
            totalPrice: state.getPrice(),
            topTexture: state.topTexture
        };

        try {
            const response = await fetch(`http://localhost:3000/api/update-config/${state.editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) alert("Changes saved successfully!");
        } catch (err) {
            console.error("Update error:", err);
        }
    }

}))