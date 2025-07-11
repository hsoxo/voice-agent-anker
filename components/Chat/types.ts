import { int } from "three/tsl";

export interface Chat {
  text: string;
  time: string;
  role: "ai" | "user";
}

export interface Product {
  type: "product-info";
  href: string;
  text: string;
  label: string;
  postfix: string | null;
  image: string;
  callback_response: string | null;
}

export interface Button {
  label: string;
  href: string;
  position: number;
}
