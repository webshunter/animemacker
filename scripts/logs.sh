#!/bin/bash

# Anime Scene Director AI - Log Management Script
echo "📝 Anime Scene Director AI - Log Manager"
echo "========================================"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to show real-time logs (SAFE VERSION)
show_realtime_logs() {
    echo "🔄 Showing real-time logs (SAFE - will stop after 30 seconds):"
    echo "⚠️  Using timeout protection to prevent AI agent from getting stuck"
    timeout 30s pm2 logs --lines 50 --nostream || {
        echo "⏰ Timeout reached after 30s. Use 'safe-logs.sh' for safer operations."
    }
}

# Function to show specific app logs (SAFE VERSION)
show_app_logs() {
    local app_name="${1:-all}"
    local lines="${2:-50}"
    
    # Safety limits
    if [ "$lines" -gt 1000 ]; then
        echo "⚠️  Warning: Lines limit exceeded. Using maximum of 1000 lines."
        lines=1000
    fi
    
    echo "📋 Showing logs for: $app_name (last $lines lines) - SAFE MODE"
    echo "⚠️  Using timeout protection to prevent AI agent from getting stuck"
    
    timeout 15s pm2 logs "$app_name" --lines "$lines" --nostream || {
        echo "⏰ Timeout reached after 15s. Use 'safe-logs.sh' for safer operations."
    }
}

# Function to clear logs
clear_logs() {
    echo "🗑️ Clearing PM2 logs..."
    pm2 flush
    echo "✅ Logs cleared!"
}

# Function to show log files
show_log_files() {
    echo "📁 Log files location:"
    echo "PM2 logs: ~/.pm2/logs/"
    echo ""
    echo "Current log files:"
    ls -la ~/.pm2/logs/ 2>/dev/null || echo "No PM2 logs found"
    echo ""
    echo "Project logs:"
    ls -la "$PROJECT_DIR/logs/" 2>/dev/null || echo "No project logs found"
}

# Function to search logs (SAFE VERSION)
search_logs() {
    local search_term="${1}"
    local app_name="${2:-all}"
    
    if [ -z "$search_term" ]; then
        echo "❌ Please provide a search term"
        echo "Usage: $0 search \"error\" [app_name]"
        return 1
    fi
    
    echo "🔍 Searching for: '$search_term' in $app_name logs - SAFE MODE"
    echo "⚠️  Using timeout protection and limited output to prevent AI agent from getting stuck"
    
    timeout 20s pm2 logs "$app_name" --lines 500 --nostream 2>/dev/null | \
    grep -i "$search_term" | head -20 || {
        echo "⏰ No matches found or timeout reached after 20s"
    }
}

# Function to show log statistics
show_log_stats() {
    echo "📊 Log Statistics:"
    echo ""
    echo "PM2 logrotate status:"
    pm2 conf pm2-logrotate
    echo ""
    echo "Log file sizes:"
    du -sh ~/.pm2/logs/* 2>/dev/null || echo "No PM2 logs found"
    echo ""
    echo "Total log size:"
    du -sh ~/.pm2/logs/ 2>/dev/null || echo "No PM2 logs found"
}

# Function to show help
show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  realtime                    - Show real-time logs"
    echo "  show [app] [lines]          - Show logs for specific app (default: all, 50 lines)"
    echo "  clear                       - Clear all PM2 logs"
    echo "  files                       - Show log file locations"
    echo "  search \"term\" [app]         - Search logs for specific term"
    echo "  stats                       - Show log statistics"
    echo "  help                        - Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 realtime"
    echo "  $0 show animemacker-backend 100"
    echo "  $0 search \"error\" animemacker-backend"
    echo "  $0 clear"
    echo ""
}

# Main logic
case "${1:-help}" in
    "realtime")
        show_realtime_logs
        ;;
    "show")
        show_app_logs "$2" "$3"
        ;;
    "clear")
        clear_logs
        ;;
    "files")
        show_log_files
        ;;
    "search")
        search_logs "$2" "$3"
        ;;
    "stats")
        show_log_stats
        ;;
    "help")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

