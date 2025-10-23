#!/bin/bash

# Safe Log Reading for MCP - Prevents AI Agent from getting stuck
echo "🔒 Safe Log Reading for MCP"
echo "============================"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Default safety parameters
DEFAULT_LINES=50
MAX_LINES=1000
TIMEOUT_SECONDS=10
MAX_FILE_SIZE=10485760  # 10MB

# Function to safely read PM2 logs
safe_pm2_logs() {
    local app_name="${1:-all}"
    local lines="${2:-$DEFAULT_LINES}"
    local timeout="${3:-$TIMEOUT_SECONDS}"
    
    # Validate parameters
    if [ "$lines" -gt "$MAX_LINES" ]; then
        echo "⚠️  Warning: Lines limit exceeded. Using maximum of $MAX_LINES lines."
        lines=$MAX_LINES
    fi
    
    echo "📋 Reading logs for: $app_name (max $lines lines, timeout: ${timeout}s)"
    
    # Use timeout to prevent hanging
    timeout "$timeout" pm2 logs "$app_name" --lines "$lines" --nostream 2>/dev/null || {
        echo "⏰ Timeout reached after ${timeout}s. Log reading stopped for safety."
        return 1
    }
}

# Function to safely search logs
safe_log_search() {
    local search_term="${1}"
    local app_name="${2:-all}"
    local lines="${3:-100}"
    local timeout="${4:-$TIMEOUT_SECONDS}"
    
    if [ -z "$search_term" ]; then
        echo "❌ Search term is required"
        return 1
    fi
    
    echo "🔍 Searching for: '$search_term' in $app_name logs (max $lines lines)"
    
    # Use timeout and limit output
    timeout "$timeout" pm2 logs "$app_name" --lines "$lines" --nostream 2>/dev/null | \
    grep -i "$search_term" | head -20 || {
        echo "⏰ Search timeout or no matches found"
        return 1
    }
}

# Function to check log file sizes safely
safe_log_size_check() {
    local app_name="${1:-all}"
    
    echo "📊 Checking log file sizes for: $app_name"
    
    # Check PM2 logs directory
    if [ -d ~/.pm2/logs ]; then
        echo "PM2 logs directory size:"
        du -sh ~/.pm2/logs/ 2>/dev/null || echo "Unable to check PM2 logs size"
        
        echo "Individual log files:"
        ls -lh ~/.pm2/logs/ 2>/dev/null | head -10 || echo "Unable to list log files"
    else
        echo "PM2 logs directory not found"
    fi
    
    # Check project logs
    if [ -d "$PROJECT_DIR/logs" ]; then
        echo "Project logs directory size:"
        du -sh "$PROJECT_DIR/logs/" 2>/dev/null || echo "Unable to check project logs size"
    else
        echo "Project logs directory not found"
    fi
}

# Function to safely get recent errors
safe_get_errors() {
    local app_name="${1:-all}"
    local lines="${2:-50}"
    local timeout="${3:-$TIMEOUT_SECONDS}"
    
    echo "🚨 Getting recent errors for: $app_name (max $lines lines)"
    
    # Use timeout and filter for errors
    timeout "$timeout" pm2 logs "$app_name" --lines "$lines" --nostream 2>/dev/null | \
    grep -i "error\|exception\|failed\|fatal" | head -10 || {
        echo "⏰ No errors found or timeout reached"
        return 1
    }
}

# Function to safely get log statistics
safe_log_stats() {
    local app_name="${1:-all}"
    
    echo "📈 Log Statistics for: $app_name"
    
    # Get PM2 status
    pm2 status 2>/dev/null | grep -E "(online|stopped|errored)" || echo "Unable to get PM2 status"
    
    # Get logrotate status
    pm2 conf pm2-logrotate 2>/dev/null | head -10 || echo "Unable to get logrotate config"
    
    # Get recent log count
    local recent_count=$(timeout 5s pm2 logs "$app_name" --lines 100 --nostream 2>/dev/null | wc -l)
    echo "Recent log entries (last 100): $recent_count"
}

# Function to safely clear logs
safe_clear_logs() {
    local confirm="${1:-false}"
    
    if [ "$confirm" != "true" ]; then
        echo "⚠️  This will clear all PM2 logs. Use 'true' as parameter to confirm."
        return 1
    fi
    
    echo "🗑️  Clearing PM2 logs..."
    pm2 flush 2>/dev/null && echo "✅ Logs cleared successfully" || echo "❌ Failed to clear logs"
}

# Function to show help
show_help() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Safe Commands:"
    echo "  read [app] [lines] [timeout]     - Safely read logs with limits"
    echo "  search \"term\" [app] [lines]      - Safely search logs"
    echo "  errors [app] [lines]             - Get recent errors safely"
    echo "  size [app]                       - Check log file sizes"
    echo "  stats [app]                      - Get log statistics"
    echo "  clear [confirm]                  - Clear logs (requires 'true' confirm)"
    echo "  help                             - Show this help"
    echo ""
    echo "Safety Features:"
    echo "  - Maximum lines limit: $MAX_LINES"
    echo "  - Default timeout: ${TIMEOUT_SECONDS}s"
    echo "  - Always uses --nostream flag"
    echo "  - Timeout protection for all operations"
    echo ""
    echo "Examples:"
    echo "  $0 read animemacker-backend 50"
    echo "  $0 search \"error\" animemacker-backend 100"
    echo "  $0 errors animemacker-frontend 30"
    echo "  $0 size"
    echo "  $0 stats"
    echo "  $0 clear true"
}

# Main logic with safety checks
case "${1:-help}" in
    "read")
        safe_pm2_logs "$2" "$3" "$4"
        ;;
    "search")
        safe_log_search "$2" "$3" "$4" "$5"
        ;;
    "errors")
        safe_get_errors "$2" "$3" "$4"
        ;;
    "size")
        safe_log_size_check "$2"
        ;;
    "stats")
        safe_log_stats "$2"
        ;;
    "clear")
        safe_clear_logs "$2"
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

echo "✅ Safe log operation completed!"
