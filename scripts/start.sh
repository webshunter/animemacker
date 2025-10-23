#!/bin/bash

# Anime Scene Director AI - Start Script
echo "🚀 Starting Anime Scene Director AI..."

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Setup (install dependencies)
echo "📦 Setting up dependencies..."
./scripts/setup.sh

# Build frontend
echo "🔨 Building frontend..."
./scripts/build.sh

# Start with PM2
echo "🚀 Starting applications with PM2..."
pm2 start ecosystem.config.cjs

# Show status
echo "📊 Application status:"
pm2 status

echo "✅ Anime Scene Director AI is now running!"
echo "🌐 Frontend: http://localhost:5551"
echo "🔧 Backend: http://localhost:5552"
echo "📝 Logs: pm2 logs"
echo "🛑 Stop: pm2 stop all"
