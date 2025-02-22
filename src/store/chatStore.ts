import { create } from 'zustand';
import { Message, AIProvider } from '../types';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  selectedProvider: AIProvider;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setLoading: (loading: boolean) => void;
  setProvider: (provider: AIProvider) => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  selectedProvider: 'openai',
  
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
  setProvider: (provider) => set({ selectedProvider: provider }),
  clearMessages: () => set({ messages: [] }),
}));