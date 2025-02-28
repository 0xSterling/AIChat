import { useState } from 'react';

interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

interface PromptTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PromptTemplate[];
  onUseTemplate: (content: string) => void;
  onSaveTemplate: (template: Omit<PromptTemplate, 'id'>) => void;
  onDeleteTemplate: (id: string) => void;
}

const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    content: 'Please review the following code and provide suggestions for improvement:\n\n',
    category: 'Development'
  },
  {
    id: 'explain-concept',
    name: 'Explain Concept',
    content: 'Please explain the following concept in simple terms:\n\n',
    category: 'Learning'
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    content: 'Write a creative story about:\n\n',
    category: 'Creative'
  },
  {
    id: 'business-email',
    name: 'Business Email',
    content: 'Help me write a professional business email about:\n\n',
    category: 'Business'
  }
];

export default function PromptTemplates({
  isOpen,
  onClose,
  templates,
  onUseTemplate,
  onSaveTemplate,
  onDeleteTemplate,
}: PromptTemplatesProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: 'General'
  });
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const allTemplates = [...DEFAULT_TEMPLATES, ...templates];
  const categories = ['All', ...new Set(allTemplates.map(t => t.category))];
  const filteredTemplates = selectedCategory === 'All' 
    ? allTemplates 
    : allTemplates.filter(t => t.category === selectedCategory);

  const handleSave = () => {
    if (newTemplate.name.trim() && newTemplate.content.trim()) {
      onSaveTemplate({
        name: newTemplate.name.trim(),
        content: newTemplate.content.trim(),
        category: newTemplate.category
      });
      setNewTemplate({ name: '', content: '', category: 'General' });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Prompt Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
            >
              + New Template
            </button>
          </div>

          {showCreateForm && (
            <div className="p-4 border rounded-lg bg-gray-50 mb-4">
              <h3 className="font-medium mb-3">Create New Template</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Template name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="General">General</option>
                  <option value="Development">Development</option>
                  <option value="Creative">Creative</option>
                  <option value="Business">Business</option>
                  <option value="Learning">Learning</option>
                </select>
                <textarea
                  placeholder="Template content..."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewTemplate({ name: '', content: '', category: 'General' });
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">{template.name}</h3>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUseTemplate(template.content)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Use
                    </button>
                    {!DEFAULT_TEMPLATES.find(t => t.id === template.id) && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this template?')) {
                            onDeleteTemplate(template.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{template.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}