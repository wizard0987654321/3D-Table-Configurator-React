import { create } from 'zustand'

export const useConfiguratorStore = create((set, get) => ({
    // 1. State: Colors & Materials
    topColor: '#6c8bff',
    legColor: '#555555',
    topMaterial: 'wood',
    legMaterial: 'metal',

    // 2. State: Dimensions (cm)
    width: 120,
    height: 75,
    depth: 80,

    // 3. State: Plate & Legs
    plateShape: 'rect',
    thicknessCm: 4,
    legType: 'square',

    // 4. Action: Update fields
    setField: (key, value) => set({ [key]: value }),

    // 5. Logic: Calculate Price
    getPrice: () => {
        const { width, depth, height, topMaterial, legMaterial, legType, thicknessCm } = get()
        
        let price = 150;
        // Price formula: $$Price_{total} = Price_{base} \cdot \left(\frac{width \cdot depth}{120 \cdot 80}\right) + \text{Add-ons}$$
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

    // 6. Action: Save to Database (ADD THIS HERE)
    saveConfiguration: async () => {
    const state = get();
    const userId = localStorage.getItem('userId');

    if (!userId) return alert("Please log in!");

    // Construct the flat object
    const payload = {
        userId: userId,
        configName: `Table ${new Date().toLocaleDateString()}`,
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
        totalPrice: state.getPrice()
    };

    try {
        const response = await fetch('http://localhost:3000/api/save-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload), // Send the flat object
        });

        if (response.ok) alert("Saved successfully into columns!");
    } catch (err) {
        console.error("Save error:", err);
    }
}
}))