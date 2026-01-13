import { create } from 'zustand'

export const useConfiguratorStore = create((set, get) => ({
    // Farben & Materialien
    topColor: '#6c8bff',
    legColor: '#555555',
    topMaterial: 'wood',   // 'wood' | 'plastic' | 'glass'
    legMaterial: 'metal',  // 'metal' | 'wood'

    // Maße (cm)
    width: 120,
    height: 75,
    depth: 80,

    // Platte
    plateShape: 'rect', // 'rect' | 'round'
    thicknessCm: 4,     // 3 | 4 | 6

    // Beine
    legType: 'square',  // 'square' | 'round' | 'uFrame' | 'pedestal'

    setField: (key, value) => set({ [key]: value }),

    getPrice: () => {
        const {
            width,
            depth,
            height,
            topMaterial,
            legMaterial,
            legType,
            thicknessCm,
        } = get()

        let price = 150
        price *= (width * depth) / (120 * 80)

        if (height > 75) price += 50

        // Material-Aufpreise (Beispiel)
        if (topMaterial === 'glass') price += 80
        if (topMaterial === 'wood') price += 40
        if (legMaterial === 'wood') price += 20

        // Bein-Typ Aufpreise
        if (legType === 'uFrame') price += 60
        if (legType === 'pedestal') price += 50

        // Plattenstärke
        if (thicknessCm === 6) price += 70
        if (thicknessCm === 3) price -= 20

        return Math.round(price)
    },
}))
