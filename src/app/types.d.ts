declare namespace team {
    export interface TeamType {
        id: string;
        name: string;
        tags: string[];
        content: string;
        date: Date;
        count: number;
        image: string | StaticImageData;
    }
}

declare type CardType = {
    id: number;
    src: string | StaticImageData;
    title: string;
    description: string;
}

declare type FaqType = {
    id: number;
    question: string;
    answer: string;
}

type FooterActivityType = {
    "cover": string | StaticImageData;
    "alt": string;
    "description": string;
}
