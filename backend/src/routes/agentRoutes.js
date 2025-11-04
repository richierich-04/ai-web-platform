// backend/src/routes/agentRoutes.js
import express from 'express';
import ideationAgent from '../agents/ideationAgent.js';
import codingAgent from '../agents/codingAgent.js';
import documentationAgent from '../agents/documentationAgent.js';

const router = express.Router();

// Ideation endpoint
router.post('/ideation', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await ideationAgent.generateIdeation(prompt);
    res.json(result);
  } catch (error) {
    console.error('Ideation route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Coding endpoint
router.post('/code', async (req, res) => {
  try {
    const { ideation, specificRequest } = req.body;
    
    if (!ideation) {
      return res.status(400).json({ error: 'Ideation data is required' });
    }

    const result = await codingAgent.generateCode(ideation, specificRequest);
    res.json(result);
  } catch (error) {
    console.error('Coding route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Code update endpoint
router.post('/code/update', async (req, res) => {
  try {
    const { existingCode, updateRequest } = req.body;
    
    if (!existingCode || !updateRequest) {
      return res.status(400).json({ error: 'Existing code and update request are required' });
    }

    const result = await codingAgent.updateCode(existingCode, updateRequest);
    res.json(result);
  } catch (error) {
    console.error('Code update route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Documentation endpoint
router.post('/documentation', async (req, res) => {
  try {
    const { codeFiles, ideation } = req.body;
    
    if (!codeFiles || !ideation) {
      return res.status(400).json({ error: 'Code files and ideation data are required' });
    }

    const result = await documentationAgent.generateDocumentation(codeFiles, ideation);
    res.json(result);
  } catch (error) {
    console.error('Documentation route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Documentation update endpoint
router.post('/documentation/update', async (req, res) => {
  try {
    const { existingDocs, codeChanges } = req.body;
    
    if (!existingDocs || !codeChanges) {
      return res.status(400).json({ error: 'Existing documentation and code changes are required' });
    }

    const result = await documentationAgent.updateDocumentation(existingDocs, codeChanges);
    res.json(result);
  } catch (error) {
    console.error('Documentation update route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default router;