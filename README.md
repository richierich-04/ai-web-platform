# AI Web Platform - Multi-Agent Development System

A sophisticated multi-agent AI platform that streamlines the entire SDLC process for React web applications. This platform leverages Google's Gemini 2.0 Flash API to power intelligent agents that handle ideation, coding, and documentation.

## 🚀 Features

- **Ideation Agent**: Transforms user requirements into comprehensive project specifications
- **Coding Agent**: Generates production-ready React code based on ideation
- **Documentation Agent**: Creates and maintains comprehensive project documentation
- **Live Preview**: Real-time preview of generated React applications
- **File Management**: Organized file structure with download capabilities

## 🏗️ Architecture

### Frontend (React + Vite)
- Modern React 18 with hooks
- Tailwind CSS for styling
- Real-time code preview
- Responsive design

### Backend (Node.js + Express)
- RESTful API architecture
- Gemini 2.0 Flash integration
- Modular agent system
- Error handling and validation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_api_key_here

# Start the server
npm run dev
```

The backend server will run on `http://localhost:3001`

### Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Generate Ideation**
   - Enter your project description in the Ideation panel
   - Click "Generate Ideation" to get a comprehensive project spec
   - Review features, components, and architecture

2. **Generate Code**
   - Switch to the Coding tab
   - Click "Generate Code" to create React components
   - Browse generated files in the file explorer
   - Download individual files or all files at once

3. **View Live Preview**
   - Switch to the Live Preview tab
   - See your generated application running in real-time
   - Test functionality and interactions

4. **Generate Documentation**
   - Switch to the Documentation tab
   - Click "Generate Documentation"
   - Download comprehensive README.md

## 📁 Project Structure
```
ai-web-platform/
├── backend/
│   ├── src/
│   │   ├── agents/           # AI agent implementations
│   │   ├── services/         # Gemini service integration
│   │   ├── routes/           # API routes
│   │   └── server.js         # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service
│   │   └── App.jsx          # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

- `POST /api/agents/ideation` - Generate project ideation
- `POST /api/agents/code` - Generate React code
- `POST /api/agents/documentation` - Generate documentation
- `GET /api/agents/health` - Health check

## 🛠️ Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)
- Axios
- React Markdown

### Backend
- Node.js
- Express
- Google Generative AI (Gemini 2.0 Flash)
- CORS
- dotenv

## 🔮 Future Enhancements

- Testing Agent (Unit & Integration tests)
- Git/Deployment Agent (Auto-deploy to Vercel/Netlify)
- Code optimization suggestions
- Multiple framework support (Vue, Angular)
- Collaborative features
- Version control integration

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Gemini 2.0 Flash