// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    // Use gemini-2.0-flash-exp or gemini-1.5-flash
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
  }

  async generateContent(prompt, systemPrompt = '') {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
      }

      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      
      console.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini API');
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // More detailed error logging
      if (error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your .env file');
      }
      
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async generateStreamContent(prompt, systemPrompt = '') {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      
      const result = await this.model.generateContentStream(fullPrompt);
      return result.stream;
    } catch (error) {
      console.error('Gemini Stream Error:', error);
      throw new Error(`Failed to generate stream: ${error.message}`);
    }
  }
}

export default new GeminiService();