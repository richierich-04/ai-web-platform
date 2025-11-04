// frontend/src/components/IdeationPanel.jsx
import React from 'react';
import { Rocket, CheckCircle, Layers, Zap, Target } from 'lucide-react';

const IdeationPanel = ({ ideation, onPrototype, loading }) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl mb-4">
          <Target className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Project Blueprint Ready! 🎉
        </h2>
        <p className="text-gray-600 text-lg">
          Here's your comprehensive project plan
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <h3 className="text-3xl font-bold mb-3">{ideation.projectName}</h3>
          <p className="text-purple-100 text-lg leading-relaxed">{ideation.description}</p>
        </div>

        {/* Content Grid */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h4 className="text-xl font-bold text-gray-900">Key Features</h4>
            </div>
            <ul className="space-y-3">
              {ideation.features?.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Components */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-6 h-6 text-blue-600" />
              <h4 className="text-xl font-bold text-gray-900">Components</h4>
            </div>
            <div className="space-y-3">
              {ideation.components?.map((component, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                  <p className="font-semibold text-gray-900">{component.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{component.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h4 className="text-xl font-bold text-gray-900">Tech Stack</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Frontend:</p>
                <div className="flex flex-wrap gap-2">
                  {ideation.techStack?.frontend?.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {ideation.techStack?.backend?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Backend:</p>
                  <div className="flex flex-wrap gap-2">
                    {ideation.techStack.backend.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Flows */}
          {ideation.userFlows && ideation.userFlows.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-orange-600" />
                <h4 className="text-xl font-bold text-gray-900">User Flows</h4>
              </div>
              <ul className="space-y-2">
                {ideation.userFlows.map((flow, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-600">→</span>
                    <span className="text-sm">{flow}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Prototype Button */}
      <div className="text-center">
        <button
          onClick={onPrototype}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-[1.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 mx-auto"
        >
          <Rocket className="w-7 h-7" />
          Prototype This App
        </button>
        <p className="text-gray-500 mt-4 text-sm">
          Click to generate production-ready React code
        </p>
      </div>
    </div>
  );
};

export default IdeationPanel;