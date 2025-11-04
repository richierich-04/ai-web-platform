// frontend/src/components/FileExplorer.jsx
import React from 'react';
import { Folder, File } from 'lucide-react';

const FileExplorer = ({ files, onFileSelect, selectedFile }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Folder className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Project Files</h3>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-gray-500">No files generated yet</p>
      ) : (
        <div className="space-y-1">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => onFileSelect(file)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                selectedFile === file
                  ? 'bg-blue-100 text-blue-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <File className="w-4 h-4" />
              <span className="truncate">{file.path.split('/').pop()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;