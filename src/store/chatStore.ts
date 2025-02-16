import { create } from 'zustand';
import { Message } from '../types';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (content, role) => 
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: generateId(),
          content,
          role,
          timestamp: new Date(),
        },
      ],
    })),
    
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}));