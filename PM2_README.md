# PM2 Setup untuk Anime Scene Director AI

## Prerequisites
- Node.js (v18+)
- PM2 installed globally: `npm install -g pm2`

## Quick Start

### 1. Setup dan Start (Recommended)
```bash
npm run pm2:start
```
Script ini akan:
- Install dependencies untuk frontend dan backend
- Build frontend
- Start backend dan frontend dengan PM2

### 2. Manual Setup
```bash
# Setup dependencies
npm run pm2:setup

# Start applications
pm2 start ecosystem.config.js
```

## Available Commands

### NPM Scripts
```bash
npm run pm2:setup    # Install dependencies
npm run pm2:start    # Setup + Build + Start
npm run pm2:stop     # Stop all applications
npm run pm2:restart  # Restart all applications
npm run pm2:logs     # View logs
npm run pm2:status   # Check status
```

### Direct PM2 Commands
```bash
pm2 start ecosystem.config.js    # Start applications
pm2 stop all                     # Stop all applications
pm2 delete all                   # Delete all applications
pm2 restart all                  # Restart all applications
pm2 logs                         # View logs
pm2 status                       # Check status
pm2 monit                        # Monitor applications
```

## Application URLs
- **Frontend**: http://localhost:5551
- **Backend**: http://localhost:5552

## Logs
- Backend logs: `./logs/backend-*.log`
- Frontend logs: `./logs/frontend-*.log`
- View all logs: `pm2 logs`

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
sudo lsof -ti:5551 | xargs kill -9
sudo lsof -ti:5552 | xargs kill -9

# Then restart
npm run pm2:restart
```

### Permission Issues
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Clean Restart
```bash
# Stop and delete all
pm2 stop all
pm2 delete all

# Start fresh
npm run pm2:start
```

## Production Deployment

### 1. Environment Variables
Create `.env` file in root directory:
```
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
```

### 2. Start Production
```bash
npm run pm2:start
```

### 3. Auto-restart on System Reboot
```bash
pm2 startup
pm2 save
```

## Monitoring
- View real-time logs: `pm2 logs`
- Monitor resources: `pm2 monit`
- Check status: `pm2 status`
- Restart specific app: `pm2 restart animemacker-backend`
