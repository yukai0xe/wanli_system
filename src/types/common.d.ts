import { StaticImageData } from "next/image";

declare global {
  interface fileObject {
    id: string,
    file: File,
    displayName: string,
    type: FileType
  }

  type InputObject = { type: "text"} | { type: "date"} | { type: "checkbox"} | { type: "number"} |
  {
    type: "select",
    value: {
        label: string,
        value: string  
    }[]
  } |
  {
    type: "multicheckbox",
    value: {
      label: string,
      value: string
    }[]
  }
  
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

  type RowData = {
    id: number;
    [key: string]: number | string | boolean | undefined;
  };
  
  type RowHeader = {
    key: string;
    label: string;
    type: InputObject;
    validate: (v: string) => boolean;
  };
}

export { };