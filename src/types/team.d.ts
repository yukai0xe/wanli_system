import { StaticImageData } from "next/image";

declare global {
  export interface Team {
    id: number;
    name: string;
    tags: string[];
    content: string;
    date: Date;
    count: number;
    image: string | StaticImageData;
  }

  type TeamSchema = {
    id: number;
    name: string;
    date: Date;
    teamsize: number;
    duration: number;
    place: string;
    summary: string;
    content: string;
    image: string;
  };
} 

export { };