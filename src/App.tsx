import { useState } from 'react';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import AIProviderSelector from './components/AIProviderSelector';
import SettingsPanel from './components/SettingsPanel';
import { useChatStore } from './store/chatStore';

function App() {
  const { messages, isLoading, selectedProvider, apiKeys, addMessage, setLoading, setProvider, setApiKey } = useChatStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleSendMessage = async (content: string) => {
    addMessage(content, 'user');
    setLoading(true);
    
    // Simulate AI response with provider-specific messages
    setTimeout(() => {
      const responses = {
        openai: 'Hello! This is a simulated GPT response.',
        claude: 'Hi there! This is a simulated Claude response.',
        gemini: 'Greetings! This is a simulated Gemini response.'
      };
      addMessage(responses[selectedProvider], 'assistant');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">AIChat</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col min-h-0">
        <AIProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={setProvider}
        />
        <ChatContainer messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
      
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKeys={apiKeys}
        onUpdateApiKey={setApiKey}
      />
    </div>
  );
}

export default App