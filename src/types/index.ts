export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export type AIProvider = 'openai' | 'claude' | 'gemini';