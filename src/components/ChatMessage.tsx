interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  return (
    <div className={`mb-4 flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        <p className="text-sm">{content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}