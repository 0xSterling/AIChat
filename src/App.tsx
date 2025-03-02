import { useState, useRef } from 'react';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import AIProviderSelector from './components/AIProviderSelector';
import SettingsPanel from './components/SettingsPanel';
import ThemeToggle from './components/ThemeToggle';
import MessageSearch from './components/MessageSearch';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { useChatStore } from './store/chatStore';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useTheme(); // Initialize theme
  const { messages, isLoading, selectedProvider, apiKeys, addMessage, setLoading, setProvider, setApiKey } = useChatStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

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

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onSettings: () => setShowSettings(true),
    onNewChat: () => {
      if (confirm('Start a new chat? This will clear current messages.')) {
        // Clear messages logic would go here
      }
    },
    onFocusInput: () => messageInputRef.current?.focus(),
  });

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="relative bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AIChat</h1>
        <div className="flex items-center space-x-3">
          <MessageSearch 
            messages={messages}
            onHighlight={setHighlightedMessageId}
          />
          <ThemeToggle />
          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title="Keyboard shortcuts (?)"
          >
            ?
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
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
        <ChatContainer messages={messages} isLoading={isLoading} />
        <MessageInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading}
          ref={messageInputRef}
        />
      </div>
      
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKeys={apiKeys}
        onUpdateApiKey={setApiKey}
      />
      
      <KeyboardShortcuts
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
    </div>
  );
}

export default App