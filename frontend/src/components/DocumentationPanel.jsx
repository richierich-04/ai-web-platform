// frontend/src/components/DocumentationPanel.jsx
import React from 'react';
import { FileText, Download, ArrowLeft, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DocumentationPanel = ({ documentation, onBack }) => {
  const downloadDocumentation = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Project Documentation 📚</h2>
              <p className="text-sm text-gray-600">Comprehensive guide for your project</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Code
            </button>
            <button
              onClick={downloadDocumentation}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download README
            </button>
          </div>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="bg-white rounded-b-2xl shadow-lg overflow-auto p-8" style={{ height: 'calc(100% - 100px)' }}>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{documentation}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPanel;