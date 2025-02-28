import { Message } from '../types';

export interface ExportData {
  messages: Message[];
  timestamp: string;
  version: string;
  sessionName?: string;
}

export const exportChatSession = (messages: Message[], sessionName?: string): void => {
  const exportData: ExportData = {
    messages,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    sessionName: sessionName || `Chat Session ${new Date().toLocaleDateString()}`
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `aichat-${exportData.sessionName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportChatAsMarkdown = (messages: Message[], sessionName?: string): void => {
  const title = sessionName || `Chat Session ${new Date().toLocaleDateString()}`;
  
  let markdown = `# ${title}\n\n`;
  markdown += `*Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n\n`;
  markdown += '---\n\n';
  
  messages.forEach((message, index) => {
    const timestamp = new Date(message.timestamp).toLocaleString();
    const role = message.role === 'user' ? '👤 User' : '🤖 Assistant';
    
    markdown += `## ${role} (${timestamp})\n\n`;
    markdown += `${message.content}\n\n`;
    
    if (index < messages.length - 1) {
      markdown += '---\n\n';
    }
  });
  
  const dataUri = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown);
  const exportFileDefaultName = `aichat-${title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.md`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importChatSession = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: ExportData = JSON.parse(content);
        
        // Validate the imported data
        if (!data.messages || !Array.isArray(data.messages)) {
          throw new Error('Invalid file format: messages array not found');
        }
        
        // Validate message structure
        data.messages.forEach((msg, index) => {
          if (!msg.id || !msg.content || !msg.role || !msg.timestamp) {
            throw new Error(`Invalid message format at index ${index}`);
          }
          // Convert timestamp strings back to Date objects
          msg.timestamp = new Date(msg.timestamp);
        });
        
        resolve(data);
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};