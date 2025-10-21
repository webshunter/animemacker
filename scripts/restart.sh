#!/bin/bash

# Anime Scene Director AI - Restart Script
echo "🔄 Restarting Anime Scene Director AI..."

# Stop existing processes
./scripts/stop.sh

# Wait a moment
sleep 2

# Start again
./scripts/start.sh
