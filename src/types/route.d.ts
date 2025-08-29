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

    type Route = Record<string, RecordPoint[]>
}

export {}