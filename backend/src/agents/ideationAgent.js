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

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no extra text.

Provide structured output in this EXACT JSON format:
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
      console.log('\n=== IDEATION AGENT START ===');
      console.log('User Prompt:', userPrompt);

      const enhancedPrompt = `
User Request: ${userPrompt}

Please analyze this request and provide a comprehensive ideation document that includes:
1. Clear project name and description
2. List of features to implement
3. Component breakdown with purposes
4. File structure recommendations
5. User flows and interactions
6. Design considerations

IMPORTANT: Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.
Start your response directly with { and end with }`;

      console.log('Calling Gemini API...');
      const response = await geminiService.generateContent(
        enhancedPrompt,
        this.systemPrompt
      );

      console.log('Raw Gemini Response:', response);
      console.log('Response length:', response.length);

      // Clean response to extract JSON
      let cleanedResponse = response.trim();
      
      // Remove markdown code blocks
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }

      // Find JSON object in response
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }

      console.log('Cleaned Response:', cleanedResponse.substring(0, 200) + '...');

      let ideation;
      try {
        ideation = JSON.parse(cleanedResponse);
        console.log('Successfully parsed JSON');
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Failed to parse:', cleanedResponse.substring(0, 500));
        throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
      }

      // Validate required fields
      const requiredFields = ['projectName', 'description', 'features', 'components'];
      const missingFields = requiredFields.filter(field => !ideation[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('=== IDEATION AGENT SUCCESS ===\n');
      
      return {
        success: true,
        ideation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('=== IDEATION AGENT ERROR ===');
      console.error('Error Type:', error.constructor.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('=== END ERROR ===\n');

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