declare namespace team {
    export interface TeamType {
        id: number;
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

declare type FaqSchema = {
    id: number;
    question: string;
    answer: string;
}

declare type FaqType = {
    id: number;
    title: string;
    content: string;
}

type FooterActivityType = {
    "cover": string | StaticImageData;
    "alt": string;
    "description": string;
}

declare type TeamSchema = {
    id: number;
    name: string;
    date: Date;
    teamsize: number;
    duration: number;
    place: string;
    summary: string;
    content: string;
    image: string;
}