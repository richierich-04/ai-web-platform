// frontend/src/components/IdeationPanel.jsx
import React, { useState } from 'react';
import { Lightbulb, Send, Loader } from 'lucide-react';

const IdeationPanel = ({ onIdeationGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideation, setIdeation] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const result = await onIdeationGenerated(prompt);
      setIdeation(result.ideation);
    } catch (error) {
      console.error('Error generating ideation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          <h2 className="text-xl font-bold">Ideation Agent</h2>
        </div>
        <p className="text-sm mt-1 opacity-90">Describe your project idea</p>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a todo list app with categories, due dates, and priority levels..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating Ideation...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate Ideation
            </>
          )}
        </button>

        {ideation && (
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold text-lg text-purple-900 mb-2">
                {ideation.projectName}
              </h3>
              <p className="text-gray-700">{ideation.description}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
              <ul className="list-disc list-inside space-y-1">
                {ideation.features?.map((feature, idx) => (
                  <li key={idx} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Components:</h4>
              <div className="space-y-2">
                {ideation.components?.map((component, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-900">{component.name}</p>
                    <p className="text-sm text-gray-600">{component.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Tech Stack:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Frontend:</p>
                  <div className="flex flex-wrap gap-1">
                    {ideation.techStack?.frontend?.map((tech, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {ideation.techStack?.backend?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Backend:</p>
                    <div className="flex flex-wrap gap-1">
                      {ideation.techStack.backend.map((tech, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeationPanel;