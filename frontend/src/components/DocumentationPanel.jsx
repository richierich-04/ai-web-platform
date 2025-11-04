// frontend/src/components/DocumentationPanel.jsx
import React, { useState } from 'react';
import { FileText, RefreshCw, Loader, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DocumentationPanel = ({ ideation, codeFiles, onDocumentationGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [documentation, setDocumentation] = useState('');

  const handleGenerateDocumentation = async () => {
    if (!ideation || !codeFiles || codeFiles.length === 0) return;

    setLoading(true);
    try {
      const result = await onDocumentationGenerated(codeFiles, ideation);
      setDocumentation(result.documentation || '');
    } catch (error) {
      console.error('Error generating documentation:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl font-bold">Documentation Agent</h2>
          </div>
          {documentation && (
            <button
              onClick={downloadDocumentation}
              className="flex items-center gap-2 bg-white text-orange-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
        <p className="text-sm mt-1 opacity-90">Auto-generate comprehensive docs</p>
      </div>

      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleGenerateDocumentation}
          disabled={loading || !ideation || !codeFiles || codeFiles.length === 0}
          className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating Documentation...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Generate Documentation
            </>
          )}
        </button>

        {(!ideation || !codeFiles || codeFiles.length === 0) && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Generate code first to create documentation
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {documentation ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{documentation}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">No documentation generated yet</p>
            <p className="text-sm mt-2 text-center">Click "Generate Documentation" to create comprehensive docs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationPanel;