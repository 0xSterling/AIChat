import { useState } from 'react';
import { Message } from '../types';

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onCreateSession: () => void;
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, name: string) => void;
}

export default function ChatHistory({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onCreateSession,
  onLoadSession,
  onDeleteSession,
  onRenameSession,
}: ChatHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleRename = (sessionId: string) => {
    if (editName.trim()) {
      onRenameSession(sessionId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const startEdit = (session: ChatSession) => {
    setEditingId(session.id);
    setEditName(session.name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <button
            onClick={onCreateSession}
            className="w-full p-3 mb-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            + New Chat Session
          </button>
          
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  currentSessionId === session.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onLoadSession(session.id)}
              >
                <div className="flex items-center justify-between">
                  {editingId === session.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRename(session.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(session.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setEditName('');
                        }
                      }}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 truncate">
                        {session.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.messages.length} messages • {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(session);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this chat session?')) {
                          onDeleteSession(session.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {sessions.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No chat sessions yet
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}