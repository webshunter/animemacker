#!/bin/bash

# Anime Scene Director AI - Monitoring Script
echo "🎬 Anime Scene Director AI - Project Monitor"
echo "=============================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Function to check PM2 status
check_pm2_status() {
    echo "📊 PM2 Status:"
    pm2 status
    echo ""
}

# Function to check logs
check_logs() {
    echo "📝 Recent Logs (last 10 lines):"
    echo "Backend logs:"
    pm2 logs animemacker-backend --lines 5 --nostream
    echo ""
    echo "Frontend logs:"
    pm2 logs animemacker-frontend --lines 5 --nostream
    echo ""
}

# Function to check disk usage
check_disk_usage() {
    echo "💾 Disk Usage:"
    echo "Project directory:"
    du -sh "$PROJECT_DIR"
    echo ""
    echo "PM2 logs directory:"
    du -sh ~/.pm2/logs/ 2>/dev/null || echo "PM2 logs directory not found"
    echo ""
    echo "Storage directory:"
    du -sh "$PROJECT_DIR/storage" 2>/dev/null || echo "Storage directory not found"
    echo ""
}

# Function to check database
check_database() {
    echo "🗄️ Database Status:"
    if [ -f "$PROJECT_DIR/backend/database.sqlite" ]; then
        echo "Database file exists: $(ls -lh "$PROJECT_DIR/backend/database.sqlite")"
        echo "Database size: $(du -h "$PROJECT_DIR/backend/database.sqlite" | cut -f1)"
    else
        echo "Database file not found!"
    fi
    echo ""
}

# Function to check ports
check_ports() {
    echo "🌐 Port Status:"
    echo "Backend (5552):"
    netstat -tlnp | grep :5552 || echo "Port 5552 not listening"
    echo "Frontend (5551):"
    netstat -tlnp | grep :5551 || echo "Port 5551 not listening"
    echo ""
}

# Function to show help
show_help() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  status    - Show PM2 status"
    echo "  logs      - Show recent logs"
    echo "  disk      - Show disk usage"
    echo "  db        - Show database status"
    echo "  ports     - Show port status"
    echo "  all       - Show all information (default)"
    echo "  help      - Show this help"
    echo ""
}

# Main logic
case "${1:-all}" in
    "status")
        check_pm2_status
        ;;
    "logs")
        check_logs
        ;;
    "disk")
        check_disk_usage
        ;;
    "db")
        check_database
        ;;
    "ports")
        check_ports
        ;;
    "all")
        check_pm2_status
        check_logs
        check_disk_usage
        check_database
        check_ports
        ;;
    "help")
        show_help
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac

echo "✅ Monitor check completed!"

