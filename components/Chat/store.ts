import { create } from "zustand";
import { Button, Product } from "./types";

interface Chat {
  text: string;
  time: string;
  role: "ai" | "user";
}

interface ChatContext {
  chatId: string | null;
  appId: string | null;
  isBotLoading: boolean;
  setIsBotLoading: (loading: boolean) => void;
  chats: Chat[];
  addChat: (chat: Chat) => void;
  followUpQuestions: string[];
  setFollowUpQuestions: (questions: string[]) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  buttons: Button[];
  setButtons: (buttons: Button[]) => void;
  setChatId: (chatId: string) => void;
  setAppId: (appId: string) => void;
}

export const useChatStore = create<ChatContext>((set) => ({
  chatId: null,
  appId: null,
  isBotLoading: false,
  setIsBotLoading: (loading: boolean) => set({ isBotLoading: loading }),
  chats: [
    {
      text: "Hello, I'm here to help you with any questions you might have.",
      time: new Date().toISOString(),
      role: "ai",
    },
  ],
  addChat: (chat: Chat) =>
    set((state) => {
      const prev = state.chats;
      const last = prev[prev.length - 1];
      if (last && last.role === "user") {
        if (last.text === chat.text) return {};
      }
      const existing = prev.findIndex(
        (c) => c.time === chat.time && c.role === chat.role
      );
      if (existing > -1) {
        const newChats = [...prev];
        newChats[existing] = {
          ...newChats[existing],
          text: newChats[existing].text + chat.text,
        };
        return {
          chats: newChats,
        };
      }
      return {
        chats: [...prev, chat],
      };
    }),
  followUpQuestions: [],
  setFollowUpQuestions: (questions: string[]) =>
    set({ followUpQuestions: questions }),
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  buttons: [],
  setButtons: (buttons: Button[]) =>
    set((state) => {
      const prev = state.buttons;
      console.log(state.chats);
      if (state.chats.slice(-1)[0].role === "user") {
        return {
          buttons: [
            ...prev,
            ...buttons.map((b) => ({ ...b, position: state.chats.length })),
          ],
        };
      } else {
        return {
          buttons: [
            ...prev,
            ...buttons.map((b) => ({ ...b, position: state.chats.length - 1 })),
          ],
        };
      }
    }),
  setChatId: (chatId: string) => set({ chatId }),
  setAppId: (appId: string) => set({ appId }),
}));
