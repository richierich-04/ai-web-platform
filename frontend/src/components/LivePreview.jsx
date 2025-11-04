// frontend/src/components/LivePreview.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Monitor, RefreshCw, Maximize2 } from 'lucide-react';

const LivePreview = ({ codeFiles }) => {
  const iframeRef = useRef(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (codeFiles && codeFiles.length > 0) {
      renderPreview();
    }
  }, [codeFiles]);

  const renderPreview = () => {
    if (!iframeRef.current || !codeFiles || codeFiles.length === 0) return;

    // Find main App component
    const appFile = codeFiles.find(f => f.path.includes('App.jsx')) || codeFiles[0];
    
    // Create HTML with all components
    const componentsCode = codeFiles
      .map(file => {
        const componentName = file.path.split('/').pop().replace('.jsx', '');
        return `
          // ${componentName}
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
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
          #root { min-height: 100vh; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect, useRef } = React;
          
          ${componentsCode}

          // Find and render the main App component
          const AppComponent = typeof App !== 'undefined' ? App : () => React.createElement('div', { className: 'p-8 text-center' }, 'Preview Loading...');
          
          ReactDOM.render(
            React.createElement(AppComponent),
            document.getElementById('root')
          );
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    // Clean up
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

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            <h2 className="text-xl font-bold">Live Preview</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshPreview}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              title="Refresh preview"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openInNewWindow}
              className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              title="Open in new window"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-sm mt-1 opacity-90">Real-time preview of generated code</p>
      </div>

      <div className="flex-1 bg-gray-100 p-4">
        {codeFiles && codeFiles.length > 0 ? (
          <iframe
            key={previewKey}
            ref={iframeRef}
            className="w-full h-full bg-white rounded-lg shadow-inner"
            title="Live Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Monitor className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">No preview available</p>
            <p className="text-sm mt-2 text-center">Generate code to see live preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;