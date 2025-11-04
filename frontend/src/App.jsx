// frontend/src/App.jsx
import React, { useState } from 'react';
import { Cpu, AlertCircle } from 'lucide-react';
import IdeationPanel from './components/IdeationPanel';
import CodingPanel from './components/CodingPanel';
import DocumentationPanel from './components/DocumentationPanel';
import LivePreview from './components/LivePreview';
import api from './services/api';
import './App.css';

function App() {
  const [ideation, setIdeation] = useState(null);
  const [codeFiles, setCodeFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('ideation');
  const [error, setError] = useState(null);

  const handleIdeationGenerated = async (prompt) => {
    try {
      setError(null);
      const result = await api.generateIdeation(prompt);
      
      if (result.success) {
        setIdeation(result.ideation);
        setActiveTab('coding');
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate ideation');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleCodeGenerated = async (ideationData) => {
    try {
      setError(null);
      const result = await api.generateCode(ideationData);
      
      if (result.success) {
        setCodeFiles(result.files);
        setActiveTab('preview');
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate code');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDocumentationGenerated = async (files, ideationData) => {
    try {
      setError(null);
      const result = await api.generateDocumentation(files, ideationData);
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Failed to generate documentation');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const tabs = [
    { id: 'ideation', label: 'Ideation', icon: '💡' },
    { id: 'coding', label: 'Coding', icon: '⚡' },
    { id: 'preview', label: 'Live Preview', icon: '👁️' },
    { id: 'documentation', label: 'Documentation', icon: '📄' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Web Platform</h1>
                <p className="text-sm text-gray-600">Multi-Agent Development System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                ● Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-[calc(100vh-280px)]">
          {activeTab === 'ideation' && (
            <IdeationPanel onIdeationGenerated={handleIdeationGenerated} />
          )}
          
          {activeTab === 'coding' && (
            <CodingPanel ideation={ideation} onCodeGenerated={handleCodeGenerated} />
          )}
          
          {activeTab === 'preview' && (
            <LivePreview codeFiles={codeFiles} />
          )}
          
          {activeTab === 'documentation' && (
            <DocumentationPanel
              ideation={ideation}
              codeFiles={codeFiles}
              onDocumentationGenerated={handleDocumentationGenerated}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
        <p>Powered by Gemini 2.0 Flash • Multi-Agent AI System</p>
      </footer>
    </div>
  );
}

export default App;