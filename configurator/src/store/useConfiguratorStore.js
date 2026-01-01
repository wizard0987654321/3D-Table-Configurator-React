import { create } from 'zustand'
{/*create aus der externen Library Zustand, um einen zentralen State für unsere Applikation zu erstellen*/}

export const useConfiguratorStore = create((set, get) => ({
    topColor: '#6c8bff',
    legColor: '#555555',
    topMaterial: 'wood', // 'wood' | 'plastic' | 'glass'
    legMaterial: 'metal', // 'metal' | 'wood'
    legType: 'square', // 'square' | 'round' | 'uFrame'

    width: 120,
    height: 75,
    depth: 80,

    setField: (key, value) => set({ [key]: value }),

    getPrice: () => {
        const { width, depth, height, topMaterial, legMaterial,legType } = get()
        let price = 150
        price *= (width * depth) / (120 * 80)
        if (height > 75) price += 50

        // kleine Material-Aufpreise (Beispiel)
        if (topMaterial === 'glass') price += 80
        if (topMaterial === 'wood') price += 40
        if (legMaterial === 'wood') price += 20
        if (legType === 'uFrame') price += 60 // Beispiel-Aufpreis


        return Math.round(price)
    },
}))
