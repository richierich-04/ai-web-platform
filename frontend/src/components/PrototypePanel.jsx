// frontend/src/components/PrototypePanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Code2, Eye, Download, FileCode, Monitor, RefreshCw, Maximize2 } from 'lucide-react';

const PrototypePanel = ({ codeFiles, ideation }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedFile, setSelectedFile] = useState(null);
  const iframeRef = useRef(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (codeFiles && codeFiles.length > 0) {
      setSelectedFile(codeFiles[0]);
      if (activeTab === 'preview') {
        renderPreview();
      }
    }
  }, [codeFiles]);

  useEffect(() => {
    if (activeTab === 'preview' && codeFiles && codeFiles.length > 0) {
      renderPreview();
    }
  }, [activeTab]);

  const renderPreview = () => {
    if (!iframeRef.current || !codeFiles || codeFiles.length === 0) return;

    const componentsCode = codeFiles
      .map(file => {
        return `
          // ${file.path}
          ${file.content}
        `;
      })
      .join('\n\n');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
          }
          #root { min-height: 100vh; }
          * { box-sizing: border-box; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect, useRef, useCallback, useMemo } = React;
          
          ${componentsCode}

          // Find and render the main App component
          const AppComponent = typeof App !== 'undefined' ? App : () => React.createElement('div', { className: 'p-8 text-center text-gray-500' }, 'Preview Loading...');
          
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(AppComponent));
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  };

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
    renderPreview();
  };

  const openInNewWindow = () => {
    if (!iframeRef.current) return;
    window.open(iframeRef.current.src, '_blank');
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
    codeFiles.forEach(file => downloadFile(file));
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="bg-white rounded-t-2xl shadow-lg p-4 border-b-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Prototype is Ready! 🚀</h2>
              <p className="text-sm text-gray-600">{codeFiles.length} files generated</p>
            </div>
          </div>
          <button
            onClick={downloadAllFiles}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Source Code
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100% - 140px)' }}>
        {activeTab === 'preview' ? (
          <div className="h-full flex flex-col">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">Live Preview</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={refreshPreview}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Refresh preview"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={openInNewWindow}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Open in new window"
                >
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 p-4">
              <iframe
                key={previewKey}
                ref={iframeRef}
                className="w-full h-full bg-white rounded-lg shadow-inner border-2 border-gray-200"
                title="Live Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex">
            {/* File Explorer */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-auto">
              <div className="p-3 bg-gray-100 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600">PROJECT FILES</p>
              </div>
              <div className="p-2">
                {codeFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-all text-sm ${
                      selectedFile === file
                        ? 'bg-purple-100 text-purple-900 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4" />
                      <span className="truncate">{file.path.split('/').pop()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedFile ? (
                <>
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{selectedFile.path}</span>
                    <button
                      onClick={() => downloadFile(selectedFile)}
                      className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-200 rounded"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-gray-900">
                    <pre className="text-sm text-gray-100 font-mono leading-relaxed">
                      <code>{selectedFile.content}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Select a file to view code</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrototypePanel;