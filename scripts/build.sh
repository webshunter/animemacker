#!/bin/bash

# Anime Scene Director AI - Build Script
echo "🔨 Building frontend..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Build frontend
cd "$PROJECT_DIR"
npm run build

echo "✅ Frontend build completed!"
