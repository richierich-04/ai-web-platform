// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async generateContent(prompt, systemPrompt = '') {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
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