import { StaticImageData } from "next/image";

declare global {
  type CardType = {
    id: number;
    src: string | StaticImageData;
    title: string;
    description: string;
  };

  type FaqSchema = {
    id: number;
    question: string;
    answer: string;
  };

  type FaqType = {
    id: number;
    title: string;
    content: string;
  };

  type FooterActivityType = {
    cover: string | StaticImageData;
    alt: string;
    description: string;
  };

  interface UserState {
    username: string;
    setUsername: (name: string) => void;
  }

  interface ViewState {
    loading: boolean;
    setLoading: (loading: boolean) => void;
  }
}

export { };