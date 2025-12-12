import { create } from 'zustand'

export const useConfiguratorStore = create((set, get) => ({
    color: '#6c8bff',
    width: 120,
    height: 75,
    depth: 80,

    setField: (key, value) => set({ [key]: value }),

    getPrice: () => {
        const { width, depth, height } = get()
        let price = 150
        price *= (width * depth) / (120 * 80) // Fläche
        if (height > 75) price += 50          // Aufpreis Standing Desk
        return Math.round(price)
    },
}))
