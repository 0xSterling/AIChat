import { useState } from 'react';
import { AIProvider } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: Record<AIProvider, string>;
  onUpdateApiKey: (provider: AIProvider, key: string) => void;
}

export default function SettingsPanel({ isOpen, onClose, apiKeys, onUpdateApiKey }: SettingsPanelProps) {
  const [tempKeys, setTempKeys] = useState(apiKeys);

  if (!isOpen) return null;

  const handleSave = () => {
    Object.entries(tempKeys).forEach(([provider, key]) => {
      onUpdateApiKey(provider as AIProvider, key);
    });
    onClose();
  };

  const providers = [
    { key: 'openai' as AIProvider, name: 'OpenAI', placeholder: 'sk-...' },
    { key: 'claude' as AIProvider, name: 'Anthropic Claude', placeholder: 'sk-ant-...' },
    { key: 'gemini' as AIProvider, name: 'Google Gemini', placeholder: 'AIza...' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="font-medium text-gray-700">API Keys</h3>
          {providers.map((provider) => (
            <div key={provider.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {provider.name}
              </label>
              <input
                type="password"
                placeholder={provider.placeholder}
                value={tempKeys[provider.key] || ''}
                onChange={(e) => setTempKeys({ ...tempKeys, [provider.key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          
          <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded">
            🔒 API keys are stored locally in your browser and never sent to our servers.
          </div>
        </div>
        
        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}