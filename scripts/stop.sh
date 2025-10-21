#!/bin/bash

# Anime Scene Director AI - Stop Script
echo "🛑 Stopping Anime Scene Director AI..."

# Stop all PM2 processes
pm2 stop all
pm2 delete all

echo "✅ All applications stopped!"
