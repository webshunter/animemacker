#!/bin/bash

# Anime Scene Director AI - Setup Script
echo "🎬 Setting up Anime Scene Director AI..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Create logs directory
mkdir -p "$PROJECT_DIR/logs"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$PROJECT_DIR"
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$PROJECT_DIR/backend"
npm install

# Go back to root directory
cd "$PROJECT_DIR"

echo "✅ Setup completed successfully!"
echo "🚀 Ready to start with: pm2 start ecosystem.config.cjs"
