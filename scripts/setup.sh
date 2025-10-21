#!/bin/bash

# Anime Scene Director AI - Setup Script
echo "🎬 Setting up Anime Scene Director AI..."

# Create logs directory
mkdir -p logs

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd /home/vds/Documents/vite_project/animemacker
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd /home/vds/Documents/vite_project/animemacker/backend
npm install

# Go back to root directory
cd /home/vds/Documents/vite_project/animemacker

echo "✅ Setup completed successfully!"
echo "🚀 Ready to start with: pm2 start ecosystem.config.js"
