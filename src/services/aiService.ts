import axios from 'axios';
import { AIProvider } from '../types';

interface ChatRequest {
  message: string;
  provider: AIProvider;
  apiKey: string;
}

class AIService {
  private async callOpenAI(message: string, apiKey: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.choices[0].message.content;
  }

  private async callClaude(message: string, apiKey: string): Promise<string> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
      }
    );
    
    return response.data.content[0].text;
  }

  async sendMessage({ message, provider, apiKey }: ChatRequest): Promise<string> {
    try {
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(message, apiKey);
        case 'claude':
          return await this.callClaude(message, apiKey);
        case 'gemini':
          // Gemini API implementation would go here
          throw new Error('Gemini API not yet implemented');
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`${provider} API error:`, error);
      throw new Error(`Failed to get response from ${provider}`);
    }
  }
}

export const aiService = new AIService();