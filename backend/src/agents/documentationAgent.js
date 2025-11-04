// backend/src/agents/documentationAgent.js
import geminiService from '../services/geminiService.js';

class DocumentationAgent {
  constructor() {
    this.systemPrompt = `You are an expert Technical Writer AI agent. Your role is to:
1. Generate comprehensive, clear, and well-structured documentation
2. Include setup instructions, API documentation, and usage examples
3. Document component props, functions, and workflows
4. Provide troubleshooting guides
5. Write in clear, concise technical language

Format documentation in Markdown with proper headings, code blocks, and examples.`;
  }

  async generateDocumentation(codeFiles, ideation) {
    try {
      const prompt = `
Generate comprehensive documentation for this React project.

Project Ideation:
${JSON.stringify(ideation, null, 2)}

Code Files:
${JSON.stringify(codeFiles, null, 2)}

Create documentation that includes:
1. Project Overview
2. Features
3. Installation & Setup
4. Project Structure
5. Component Documentation (for each component: purpose, props, usage examples)
6. Development Guide
7. API Integration (if applicable)
8. Troubleshooting
9. Contributing Guidelines

Format in Markdown with clear sections and code examples.`;

      const response = await geminiService.generateContent(
        prompt,
        this.systemPrompt
      );

      return {
        success: true,
        documentation: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Documentation Agent Error:', error);
      return {
        success: false,
        error: error.message,
        documentation: this.generateFallbackDocumentation(ideation)
      };
    }
  }

  async updateDocumentation(existingDocs, codeChanges) {
    try {
      const prompt = `
Update this documentation based on code changes:

Existing Documentation:
${existingDocs}

Code Changes:
${JSON.stringify(codeChanges, null, 2)}

Provide updated documentation maintaining the same structure and format.`;

      const response = await geminiService.generateContent(
        prompt,
        this.systemPrompt
      );

      return {
        success: true,
        documentation: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Documentation Update Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateFallbackDocumentation(ideation) {
    return `# ${ideation.projectName || 'Project'} Documentation

## Overview
${ideation.description || 'React application'}

## Features
${ideation.features ? ideation.features.map(f => `- ${f}`).join('\n') : ''}

## Installation
\`\`\`bash
npm install
npm run dev
\`\`\`

## Project Structure
Generated based on requirements.
`;
  }
}

export default new DocumentationAgent();