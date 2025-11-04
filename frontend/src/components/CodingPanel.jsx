// frontend/src/components/CodingPanel.jsx
import React, { useState } from 'react';
import { Code, Play, Loader, Download } from 'lucide-react';

const CodingPanel = ({ ideation, onCodeGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleGenerateCode = async () => {
    if (!ideation) return;

    setLoading(true);
    try {
      const result = await onCodeGenerated(ideation);
      setFiles(result.files || []);
      if (result.files?.length > 0) {
        setSelectedFile(result.files[0]);
      }
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (file) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    files.forEach(file => downloadFile(file));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
    <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-6 h-6" />
          <h2 className="text-xl font-bold">Coding Agent</h2>
        </div>
        {files.length > 0 && (
          <button
            onClick={downloadAllFiles}
            className="flex items-center gap-2 bg-white text-green-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        )}
      </div>
      <p className="text-sm mt-1 opacity-90">Generate React code from ideation</p>
    </div>

    <div className="flex-1 flex overflow-hidden">
      {/* File Explorer */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-auto">
        <div className="p-4">
          <button
            onClick={handleGenerateCode}
            disabled={loading || !ideation}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors mb-4"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Generate Code
              </>
            )}
          </button>

          {!ideation && (
            <div className="text-sm text-gray-500 text-center mt-8">
              Generate ideation first
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600 mb-2">Files Generated:</p>
              {files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedFile === file
                      ? 'bg-green-100 text-green-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {file.path.split('/').pop()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{selectedFile.path}</span>
              <button
                onClick={() => downloadFile(selectedFile)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-900">
              <pre className="text-sm text-gray-100 font-mono">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {files.length === 0 ? (
              <div className="text-center">
                <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No files generated yet</p>
                <p className="text-sm mt-2">Click "Generate Code" to start</p>
              </div>
            ) : (
              <p>Select a file to view</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default CodingPanel;