// frontend/src/App.jsx
import React, { useState } from 'react';
import { Sparkles, Rocket, Code2, FileText, Loader2 } from 'lucide-react';
import IdeationPanel from './components/IdeationPanel';
import PrototypePanel from './components/PrototypePanel';
import DocumentationPanel from './components/DocumentationPanel';
import api from './services/api';
import './App.css';

function App() {
  const [stage, setStage] = useState('prompt'); // prompt, ideation, prototype, documentation
  const [prompt, setPrompt] = useState('');
  const [ideation, setIdeation] = useState(null);
  const [codeFiles, setCodeFiles] = useState([]);
  const [documentation, setDocumentation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  const loadingMessages = {
    ideation: [
      '🤔 Analyzing your requirements...',
      '💡 Brainstorming brilliant ideas...',
      '🎯 Defining project scope...',
      '🏗️ Planning architecture...',
      '✨ Crafting your vision...'
    ],
    code: [
      '⚡ Generating React components...',
      '🎨 Styling with Tailwind CSS...',
      '🔧 Setting up state management...',
      '🚀 Building your prototype...',
      '✨ Adding the finishing touches...'
    ],
    documentation: [
      '📝 Writing comprehensive docs...',
      '📚 Creating usage examples...',
      '🔍 Documenting components...',
      '✅ Adding setup instructions...',
      '🎉 Finalizing documentation...'
    ]
  };

  const showLoadingMessage = (type) => {
    const messages = loadingMessages[type];
    let index = 0;
    
    setLoadingMessage(messages[0]);
    
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingMessage(messages[index]);
    }, 2000);
    
    return interval;
  };

  const handleIdeate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a project description');
      return;
    }

    setLoading(true);
    setError(null);
    const interval = showLoadingMessage('ideation');

    try {
      console.log('Requesting ideation for:', prompt);
      const result = await api.generateIdeation(prompt);
      
      console.log('Ideation result:', result);
      
      if (result.success && result.ideation) {
        setIdeation(result.ideation);
        setStage('ideation');
      } else if (result.fallback) {
        setIdeation(result.fallback);
        setStage('ideation');
        setError('Used fallback ideation. API might have issues.');
      } else {
        throw new Error(result.error || 'Failed to generate ideation');
      }
    } catch (err) {
      console.error('Ideation error:', err);
      setError(err.message || 'Failed to generate ideation. Please check your API key and try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handlePrototype = async () => {
    if (!ideation) return;

    setLoading(true);
    setError(null);
    const interval = showLoadingMessage('code');

    try {
      console.log('Generating code for ideation:', ideation);
      const result = await api.generateCode(ideation);
      
      console.log('Code generation result:', result);
      
      if (result.success && result.files && result.files.length > 0) {
        setCodeFiles(result.files);
        setStage('prototype');
      } else {
        throw new Error(result.error || 'Failed to generate code files');
      }
    } catch (err) {
      console.error('Code generation error:', err);
      setError(err.message || 'Failed to generate code. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCreateDocumentation = async () => {
    if (!codeFiles || codeFiles.length === 0 || !ideation) return;

    setLoading(true);
    setError(null);
    const interval = showLoadingMessage('documentation');

    try {
      console.log('Generating documentation...');
      const result = await api.generateDocumentation(codeFiles, ideation);
      
      console.log('Documentation result:', result);
      
      if (result.success && result.documentation) {
        setDocumentation(result.documentation);
        setStage('documentation');
      } else {
        throw new Error(result.error || 'Failed to generate documentation');
      }
    } catch (err) {
      console.error('Documentation error:', err);
      setError(err.message || 'Failed to generate documentation. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleUpdateDocumentation = async () => {
    if (!documentation || !codeFiles) return;

    setLoading(true);
    setError(null);
    const interval = showLoadingMessage('documentation');

    try {
      const result = await api.updateDocumentation(documentation, codeFiles);
      
      if (result.success && result.documentation) {
        setDocumentation(result.documentation);
      } else {
        throw new Error(result.error || 'Failed to update documentation');
      }
    } catch (err) {
      console.error('Documentation update error:', err);
      setError(err.message || 'Failed to update documentation. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleReset = () => {
    setStage('prompt');
    setPrompt('');
    setIdeation(null);
    setCodeFiles([]);
    setDocumentation('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing...</h3>
              <p className="text-gray-600 text-center">{loadingMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Dev Studio
                </h1>
                <p className="text-sm text-gray-600">Build faster with AI agents</p>
              </div>
            </div>
            
            {/* Navigation & Actions */}
            <div className="flex items-center gap-3">
              {stage === 'prototype' && (
                <>
                  <button
                    onClick={handleCreateDocumentation}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    Create Docs
                  </button>
                </>
              )}
              
              {stage === 'documentation' && (
                <button
                  onClick={handleUpdateDocumentation}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  Update Docs
                </button>
              )}
              
              {stage !== 'prompt' && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  New Project
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 font-bold text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Prompt Stage */}
        {stage === 'prompt' && (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl mb-4">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  What would you like to build?
                </h2>
                <p className="text-gray-600 text-lg">
                  Describe your project idea and let AI agents bring it to life
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Create a task management app with categories, due dates, priority levels, and a Kanban board view..."
                  className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                  disabled={loading}
                />
                
                <button
                  onClick={handleIdeate}
                  disabled={loading || !prompt.trim()}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-6 h-6" />
                  Ideate My Project
                </button>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">💡</p>
                    <p className="text-xs text-gray-600 mt-1">Smart Ideation</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">⚡</p>
                    <p className="text-xs text-gray-600 mt-1">Instant Code</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">📝</p>
                    <p className="text-xs text-gray-600 mt-1">Auto Docs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ideation Stage */}
        {stage === 'ideation' && ideation && (
          <IdeationPanel 
            ideation={ideation} 
            onPrototype={handlePrototype}
            loading={loading}
          />
        )}

        {/* Prototype Stage */}
        {stage === 'prototype' && codeFiles.length > 0 && (
          <PrototypePanel 
            codeFiles={codeFiles}
            ideation={ideation}
          />
        )}

        {/* Documentation Stage */}
        {stage === 'documentation' && documentation && (
          <DocumentationPanel 
            documentation={documentation}
            onBack={() => setStage('prototype')}
          />
        )}
      </div>
    </div>
  );
}

export default App;