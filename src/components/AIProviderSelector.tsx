import { AIProvider } from '../types';

interface AIProviderSelectorProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

const providers: { value: AIProvider; label: string; color: string }[] = [
  { value: 'openai', label: 'OpenAI GPT', color: 'text-green-600' },
  { value: 'claude', label: 'Anthropic Claude', color: 'text-orange-600' },
  { value: 'gemini', label: 'Google Gemini', color: 'text-blue-600' },
];

export default function AIProviderSelector({ selectedProvider, onProviderChange }: AIProviderSelectorProps) {
  return (
    <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 border-b">
      <span className="text-sm font-medium text-gray-700">AI Provider:</span>
      <div className="flex space-x-2">
        {providers.map((provider) => (
          <button
            key={provider.value}
            onClick={() => onProviderChange(provider.value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              selectedProvider === provider.value
                ? `bg-white shadow-sm border ${provider.color} font-medium`
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}