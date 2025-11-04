// backend/src/agents/ideationAgent.js
import geminiService from '../services/geminiService.js';

class IdeationAgent {
  constructor() {
    this.systemPrompt = `You are an expert Product Manager and Software Architect AI agent. Your role is to:
1. Analyze user requirements and ideas
2. Create comprehensive project specifications
3. Define component structure and file architecture
4. Identify key features and user flows
5. Suggest technology stack and best practices

Provide structured output in the following JSON format:
{
  "projectName": "string",
  "description": "string",
  "features": ["string"],
  "components": [
    {
      "name": "string",
      "purpose": "string",
      "props": ["string"]
    }
  ],
  "fileStructure": {
    "fileName": "description"
  },
  "techStack": {
    "frontend": ["string"],
    "backend": ["string"]
  },
  "userFlows": ["string"],
  "designConsiderations": ["string"]
}`;
  }

  async generateIdeation(userPrompt) {
    try {
      const enhancedPrompt = `
User Request: ${userPrompt}

Please analyze this request and provide a comprehensive ideation document that includes:
1. Clear project name and description
2. List of features to implement
3. Component breakdown with purposes
4. File structure recommendations
5. User flows and interactions
6. Design considerations

Return ONLY valid JSON without markdown formatting or code blocks.`;

      const response = await geminiService.generateContent(
        enhancedPrompt,
        this.systemPrompt
      );

      // Clean response to extract JSON
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }

      const ideation = JSON.parse(cleanedResponse);
      
      return {
        success: true,
        ideation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Ideation Agent Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackIdeation(userPrompt)
      };
    }
  }

  generateFallbackIdeation(userPrompt) {
    return {
      projectName: "Custom React Application",
      description: userPrompt,
      features: ["User Interface", "Component Structure", "State Management"],
      components: [
        {
          name: "App",
          purpose: "Main application component",
          props: []
        }
      ],
      fileStructure: {
        "App.jsx": "Main application component",
        "App.css": "Styling"
      },
      techStack: {
        frontend: ["React", "CSS"],
        backend: []
      },
      userFlows: ["User interacts with the application"],
      designConsiderations: ["Responsive design", "User-friendly interface"]
    };
  }
}

export default new IdeationAgent();