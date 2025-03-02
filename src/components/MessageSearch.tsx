import { useState } from 'react';
import { Message } from '../types';

interface MessageSearchProps {
  messages: Message[];
  onHighlight: (messageId: string) => void;
}

export default function MessageSearch({ messages, onHighlight }: MessageSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setResults([]);
      setCurrentIndex(0);
      return;
    }

    const filtered = messages.filter(message =>
      message.content.toLowerCase().includes(term.toLowerCase())
    );
    
    setResults(filtered);
    setCurrentIndex(0);
    
    if (filtered.length > 0) {
      onHighlight(filtered[0].id);
    }
  };

  const navigateResults = (direction: 'prev' | 'next') => {
    if (results.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % results.length;
    } else {
      newIndex = currentIndex === 0 ? results.length - 1 : currentIndex - 1;
    }
    
    setCurrentIndex(newIndex);
    onHighlight(results[newIndex].id);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        title="Search messages (Ctrl+F)"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg p-4 z-10 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800 dark:text-white">Search Messages</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
            setResults([]);
          }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search in messages..."
          className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        
        {searchTerm && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {results.length > 0 
                ? `${currentIndex + 1} of ${results.length} results`
                : 'No results found'
              }
            </span>
            
            {results.length > 1 && (
              <div className="flex space-x-1">
                <button
                  onClick={() => navigateResults('prev')}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  ↑ Prev
                </button>
                <button
                  onClick={() => navigateResults('next')}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  ↓ Next
                </button>
              </div>
            )}
          </div>
        )}
        
        {results.length > 0 && (
          <div className="max-h-40 overflow-y-auto space-y-2">
            {results.slice(0, 5).map((message, index) => (
              <div
                key={message.id}
                onClick={() => {
                  setCurrentIndex(index);
                  onHighlight(message.id);
                }}
                className={`p-2 rounded cursor-pointer text-xs ${
                  index === currentIndex
                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {message.role === 'user' ? '👤 You' : '🤖 AI'}
                </div>
                <div className="text-gray-600 dark:text-gray-400 truncate">
                  {message.content}
                </div>
              </div>
            ))}
            {results.length > 5 && (
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                ... and {results.length - 5} more results
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}