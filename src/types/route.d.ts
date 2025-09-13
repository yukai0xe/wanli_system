declare global {
    type RecordPoint = {
        id: string;
        point: string;
        arrive: string;
        depart: string;
        duration: number;
        rest: number;
        note: string;
    }

    type Route = {
        id: string;
        source: string;
        teamSize: number;
        weather: string;
        days: Record<string, RecordPoint[]>
    };
}

export {}