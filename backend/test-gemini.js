// backend/test-gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n=== GEMINI API TEST ===\n');

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  console.log('\nTo fix this:');
  console.log('1. Create a .env file in the backend directory');
  console.log('2. Add this line: GEMINI_API_KEY=your_api_key_here');
  console.log('3. Get your API key from: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

console.log('✓ API Key found in .env');
console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY.substring(0, 10) + '...');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testConnection() {
  try {
    console.log('\n--- Testing Connection ---');
    
    // Try with gemini-1.5-flash first
    console.log('Testing with model: gemini-2.0-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    console.log('Sending test prompt...');
    const result = await model.generateContent('Say "Hello, API is working!" and nothing else.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✓ Response received:', text);
    console.log('\n✅ SUCCESS! Gemini API is working correctly.\n');
    
    return true;
  } catch (error) {
    console.error('\n❌ ERROR connecting to Gemini API:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key')) {
      console.log('\n🔧 FIX: Your API key appears to be invalid.');
      console.log('1. Go to: https://aistudio.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Update your .env file with the new key');
    } else if (error.message.includes('quota') || error.message.includes('RATE_LIMIT')) {
      console.log('\n🔧 FIX: You have hit the rate limit or quota.');
      console.log('1. Wait a few minutes and try again');
      console.log('2. Check your quota at: https://aistudio.google.com/');
    } else if (error.message.includes('model not found')) {
      console.log('\n🔧 FIX: The model version is not available.');
      console.log('Try updating geminiService.js to use: gemini-1.5-pro');
    } else {
      console.log('\n🔧 Check:');
      console.log('1. Your internet connection');
      console.log('2. That the API key is correct (no extra spaces)');
      console.log('3. Gemini API status: https://status.cloud.google.com/');
    }
    
    return false;
  }
}

async function testIdeationPrompt() {
  try {
    console.log('\n--- Testing Ideation Prompt ---');
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });
    
    const prompt = `Create a JSON object for a todo app project. Return ONLY valid JSON, no markdown or code blocks.

{
  "projectName": "Todo Application",
  "description": "A simple todo list app",
  "features": ["Add tasks", "Delete tasks", "Mark complete"],
  "components": [{"name": "TodoList", "purpose": "Display todos", "props": ["todos"]}],
  "techStack": {"frontend": ["React"], "backend": []},
  "userFlows": ["User adds a task"],
  "designConsiderations": ["Simple UI"]
}

Now create a similar JSON for: Create a counter app with increment and decrement buttons`;

    console.log('Sending ideation test...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response:', text.substring(0, 300) + '...');
    
    // Try to parse JSON
    let cleaned = text.trim();
    if (cleaned.includes('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }
    
    const parsed = JSON.parse(cleaned);
    console.log('✓ Successfully parsed JSON');
    console.log('Project name:', parsed.projectName);
    
    console.log('\n✅ Ideation test passed!\n');
    return true;
  } catch (error) {
    console.error('\n❌ Ideation test failed:');
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  const connectionTest = await testConnection();
  
  if (connectionTest) {
    await testIdeationPrompt();
  }
  
  console.log('=== TEST COMPLETE ===\n');
}

runTests();