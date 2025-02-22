import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';
import AIProviderSelector from './components/AIProviderSelector';
import { useChatStore } from './store/chatStore';

function App() {
  const { messages, isLoading, selectedProvider, addMessage, setLoading, setProvider } = useChatStore();

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
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">AIChat</h1>
      </header>
      
      <div className="flex-1 flex flex-col min-h-0">
        <AIProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={setProvider}
        />
        <ChatContainer messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App