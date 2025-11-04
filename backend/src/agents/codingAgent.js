// backend/src/agents/codingAgent.js
import geminiService from '../services/geminiService.js';

class CodingAgent {
  constructor() {
    this.systemPrompt = `You are an expert Full-Stack Developer AI agent specializing in React applications. Your role is to:
1. Generate production-ready React code based on ideation documents
2. Create clean, maintainable, and well-documented code
3. Follow best practices and modern React patterns (hooks, functional components)
4. Include proper error handling and loading states
5. Write semantic HTML and accessible components

CRITICAL INSTRUCTIONS:
- Generate ONLY the code without any markdown formatting
- Do NOT wrap code in \`\`\`jsx or \`\`\` blocks
- Start directly with the import statements
- Include all necessary imports
- Use modern React practices (hooks, functional components)
- Add inline comments for complex logic
- Return valid, executable code`;
  }

  async generateCode(ideation, specificRequest = '') {
    try {
      const prompt = `
Based on this ideation document:
${JSON.stringify(ideation, null, 2)}

${specificRequest ? `Specific Request: ${specificRequest}` : ''}

Generate complete React code files for this project. For each component:
1. Use functional components with hooks
2. Include proper prop types and validation
3. Add error boundaries where appropriate
4. Implement loading and error states
5. Use Tailwind CSS for styling

Return a JSON object with this structure:
{
  "files": [
    {
      "path": "src/components/ComponentName.jsx",
      "content": "the actual code without markdown formatting"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. Do not include markdown code blocks or formatting.`;

      const response = await geminiService.generateContent(
        prompt,
        this.systemPrompt
      );

      // Clean response to extract JSON
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }

      const codeOutput = JSON.parse(cleanedResponse);

      return {
        success: true,
        files: codeOutput.files || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Coding Agent Error:', error);
      return {
        success: false,
        error: error.message,
        files: []
      };
    }
  }

  async updateCode(existingCode, updateRequest) {
    try {
      const prompt = `
Current code:
${existingCode}

Update Request: ${updateRequest}

Provide the updated code. Return ONLY the code without any markdown formatting or explanations.`;

      const response = await geminiService.generateContent(
        prompt,
        this.systemPrompt
      );

      return {
        success: true,
        updatedCode: response.trim(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Code Update Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new CodingAgent();