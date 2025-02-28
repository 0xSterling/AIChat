import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, AIProvider } from '../types';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  selectedProvider: AIProvider;
  apiKeys: Record<AIProvider, string>;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  setLoading: (loading: boolean) => void;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (provider: AIProvider, key: string) => void;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      selectedProvider: 'openai',
      apiKeys: {
        openai: '',
        claude: '',
        gemini: '',
      },
      
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
      setApiKey: (provider, key) => 
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'aichat-storage',
      partialize: (state) => ({
        selectedProvider: state.selectedProvider,
        apiKeys: state.apiKeys,
      }),
    }
  )
);