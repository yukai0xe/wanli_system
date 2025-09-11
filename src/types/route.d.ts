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
        days: Record<string, RecordPoint[]>
    };
}

export {}