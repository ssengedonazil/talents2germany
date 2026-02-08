import { create } from 'zustand';

type Message = {
  id: string;
  sender: string;
  body: string;
  createdAt?: number;
};

type ChatState = {
  activeChat: string | null;
  messages: Message[];
  setActiveChat: (id: string | null) => void;
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  activeChat: null,
  messages: [],

  setActiveChat: (id) => set({ activeChat: id }),

  setMessages: (msgs) => set({ messages: msgs }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  clearMessages: () => set({ messages: [] }),
}));
