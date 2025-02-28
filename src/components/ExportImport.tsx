import { useRef } from 'react';
import { Message } from '../types';
import { exportChatSession, exportChatAsMarkdown, importChatSession } from '../utils/exportImport';

interface ExportImportProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onImportMessages: (messages: Message[]) => void;
  sessionName?: string;
}

export default function ExportImport({
  isOpen,
  onClose,
  messages,
  onImportMessages,
  sessionName
}: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    exportChatSession(messages, sessionName);
  };

  const handleExportMarkdown = () => {
    exportChatAsMarkdown(messages, sessionName);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importChatSession(file);
      onImportMessages(data.messages);
      alert(`Successfully imported ${data.messages.length} messages`);
      onClose();
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Export / Import</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Export Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Current session: {messages.length} messages
            </p>
            <div className="space-y-2">
              <button
                onClick={handleExportJSON}
                disabled={messages.length === 0}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>📁</span>
                <span>Export as JSON</span>
              </button>
              
              <button
                onClick={handleExportMarkdown}
                disabled={messages.length === 0}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>📝</span>
                <span>Export as Markdown</span>
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-700 mb-3">Import Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Import a previously exported chat session (JSON format only)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center space-x-2"
            >
              <span>📤</span>
              <span>Import JSON File</span>
            </button>
            
            <div className="text-xs text-gray-500 mt-3 p-3 bg-yellow-50 rounded border">
              ⚠️ <strong>Warning:</strong> Importing will replace your current chat session. Make sure to export your current chat if you want to keep it.
            </div>
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