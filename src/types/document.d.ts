declare global {
    interface finalCheckState {
        personalItemList: groupData,
        teamItemList: groupData,
        supply?: groupData,
        route?: groupData,
        referenceRoute?: groupData[]
        retreatPlan: string,
        splitPlan: string,
        map?: string,
        other: {
            water: string,
            signal: string,
            transport: string,
            emergency: string
        }

        set: (partial: Partial<Omit<FinalCheckState, 'set'>>) => void;
    }
}

export { };