// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/agents', agentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Web Platform API',
    version: '1.0.0',
    endpoints: {
      ideation: 'POST /api/agents/ideation',
      code: 'POST /api/agents/code',
      documentation: 'POST /api/agents/documentation',
      health: 'GET /api/agents/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}`);
});