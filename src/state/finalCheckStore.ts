import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useFinalCheckStore = create<finalCheckState>()(
    devtools((set) => ({
        supply: undefined,
        route: undefined,
        referenceRoute: undefined,
        retreatPlan: '',
        splitPlan: '',
        map: undefined,
        other: {
            water: '',
            signal: '',
            transport: '',
            emergency: ''
        },

        set: (partial) => set((state) => ({ ...state, ...partial })),
    }), {
        name: "finalPlan"
    })
)