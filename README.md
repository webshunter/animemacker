# 🎬 Anime Scene Director AI

A powerful AI-powered application for generating anime scene prompts and managing character-based content creation. Built with React, TypeScript, Node.js, and integrated with Groq AI for intelligent prompt generation.

## ✨ Features

### 🤖 AI-Powered Scene Generation
- **Groq AI Integration**: Advanced text generation using Llama models
- **Context-Aware Prompts**: AI generates prompts based on character details and scene ideas
- **Fallback System**: Robust fallback mechanisms when AI services are unavailable
- **Smart Keyword Detection**: Automatically detects actions and environments from user input

### 🎨 Character Management
- **Character Creation**: Upload character images and descriptions
- **Character Library**: Manage multiple characters for different scenes
- **Image Reference**: Use character images as reference for scene generation
- **Copy Functionality**: Easy copying of character images and data

### 🖼️ Scene Management
- **Scene Cards**: Beautiful card-based display of generated scenes
- **Scene Details**: Detailed view with image upload and social media content
- **Image Upload**: Upload custom images for scenes with file storage
- **Real-time Updates**: Images update immediately without page refresh

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Theme**: Beautiful dark UI with purple accents
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Copy to Clipboard**: Easy copying of prompts, images, and data

### 🛠️ Production Ready
- **PM2 Process Management**: Production-ready process management
- **File Storage System**: Efficient image storage with multer
- **Database Persistence**: SQLite database for data storage
- **Log Management**: Comprehensive logging with rotation
- **Safe Log Reading**: MCP-compatible log reading for AI agents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PM2 (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/webshunter/animemacker.git
   cd animemacker
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode with PM2
   npm run pm2:start
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Groq API Key for text generation
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## 🚀 Minimal Setup for Server Deployment

### Quick Server Setup (5 minutes)

For production deployment on a server, follow these minimal steps:

#### 1. **Clone and Setup**
```bash
# Clone repository
git clone https://github.com/webshunter/animemacker.git
cd animemacker

# Copy environment template
cp .env.example .env
```

#### 2. **Configure Environment**
Edit `.env` file and add your Groq API key:
```env
VITE_GROQ_API_KEY=your_actual_groq_api_key_here
```

#### 3. **Install Dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

#### 4. **Start Application**
```bash
# Start with PM2 (production ready)
npm run pm2:start
```

#### 5. **Access Application**
- **Frontend**: `http://your-server-ip:5551`
- **Backend API**: `http://your-server-ip:5552`

### Server Requirements

- **Node.js**: 18+ 
- **Memory**: 512MB minimum
- **Storage**: 100MB for application + image storage
- **Ports**: 5551 (frontend), 5552 (backend)
- **OS**: Linux/Ubuntu recommended

### Production Commands

```bash
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# Check status
npm run pm2:status

# View logs
npm run pm2:logs

# Monitor system
npm run monitor
```

### Troubleshooting

If you encounter issues:

1. **Check PM2 status**: `npm run pm2:status`
2. **View logs**: `npm run safe-logs:errors`
3. **Check ports**: `netstat -tlnp | grep :555`
4. **Restart services**: `npm run pm2:restart`

### Security Notes

- The application runs on `0.0.0.0` to accept external connections
- Ensure your server firewall allows ports 5551 and 5552
- Keep your Groq API key secure and never commit it to version control

## 📖 Usage

### Creating Characters
1. Click "Create Your Character" button
2. Upload a character image
3. Add character name and description
4. Save the character

### Generating Scenes
1. Select a character from the dropdown
2. Enter your scene idea (e.g., "she tired and have to go sleep")
3. Click "Generate Scene"
4. AI will create image and video prompts
5. Save the scene to your library

### Managing Scenes
1. View all saved scenes in the cards view
2. Click on a scene card to see details
3. Upload custom images for scenes
4. Copy prompts and images to clipboard
5. Generate social media content

## 🛠️ Development

### Project Structure
```
animemacker/
├── backend/                 # Node.js backend
│   ├── server.js           # Express server
│   ├── database.sqlite     # SQLite database
│   └── package.json        # Backend dependencies
├── components/             # React components
│   ├── SceneCard.tsx       # Scene card component
│   ├── SceneDetail.tsx     # Scene detail view
│   ├── CharacterCreator.tsx # Character creation
│   └── icons/              # Icon components
├── services/               # API services
│   ├── geminiService.ts    # AI service integration
│   └── apiService.ts       # API calls
├── scripts/                # Utility scripts
│   ├── monitor.sh          # Project monitoring
│   ├── logs.sh             # Log management
│   └── safe-logs.sh        # Safe log reading
├── storage/                # File storage
│   └── images/             # Uploaded images
└── types.ts                # TypeScript types
```

### Available Scripts

#### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

#### PM2 Management
```bash
npm run pm2:start    # Start with PM2
npm run pm2:stop     # Stop PM2 processes
npm run pm2:restart  # Restart PM2 processes
npm run pm2:status   # Check PM2 status
npm run pm2:logs     # View PM2 logs
```

#### Monitoring & Logs
```bash
npm run monitor              # Project monitoring
npm run safe-logs:read      # Safe log reading
npm run safe-logs:search    # Search logs safely
npm run safe-logs:errors    # View errors safely
```

## 🔧 Configuration

### PM2 Configuration
The application uses PM2 for process management with the following configuration:

- **Frontend**: Vite preview server on port 5551
- **Backend**: Express server on port 5552
- **Log Rotation**: Automatic log rotation with pm2-logrotate
- **Monitoring**: Comprehensive monitoring scripts

### Database Schema
```sql
-- Scenes table
CREATE TABLE scenes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  video_prompt TEXT NOT NULL,
  generatedImage TEXT,
  image_filename TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 📚 Documentation

- **[PM2 Management Guide](PM2_MANAGEMENT.md)** - Complete PM2 setup and management
- **[PM2 Logger Guide](PM2_LOGGER_GUIDE.md)** - Log management and monitoring
- **[Safe Log Reading](SAFE_LOG_READING_GUIDE.md)** - MCP-compatible log reading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq AI** for powerful text generation
- **React** and **TypeScript** for the frontend framework
- **Express** and **SQLite** for the backend
- **PM2** for process management
- **Tailwind CSS** for styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/webshunter/animemacker/issues) page
2. Review the documentation
3. Create a new issue with detailed information

---

**Made with ❤️ for anime creators and AI enthusiasts**