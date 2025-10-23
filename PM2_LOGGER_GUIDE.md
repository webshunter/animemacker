# PM2 Logger Management Guide

## Overview
PM2 Logger adalah sistem logging terintegrasi untuk Node.js applications yang menyediakan log management, rotation, dan monitoring capabilities.

## PM2 Log Commands

### Basic Log Commands
```bash
# Show real-time logs dari semua apps
pm2 logs

# Show logs dari specific app
pm2 logs animemacker-backend
pm2 logs animemacker-frontend

# Show last N lines tanpa streaming
pm2 logs --lines 50 --nostream

# Show logs dengan filtering
pm2 logs animemacker-backend --lines 100
```

### Log Management Commands
```bash
# Clear semua PM2 logs
pm2 flush

# Show logrotate configuration
pm2 conf pm2-logrotate

# Set log rotation settings
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:workerInterval 30
```

## Custom Monitoring Scripts

### Project Monitoring
```bash
# Show all project information
npm run monitor

# Show PM2 status only
npm run monitor:status

# Show recent logs
npm run monitor:logs

# Show disk usage
npm run monitor:disk
```

### Log Management
```bash
# Show help for log manager
npm run log-manager

# Real-time log streaming
npm run logs:realtime

# Search logs for specific term
npm run logs:search "error"
npm run logs:search "PM2" animemacker-backend

# Clear all logs
npm run logs:clear
```

## PM2 Log File Structure

### Directory Structure
```
~/.pm2/logs/
├── animemacker-backend-out.log      # Backend stdout
├── animemacker-backend-error.log    # Backend stderr
├── animemacker-frontend-out.log     # Frontend stdout
├── animemacker-frontend-error.log   # Frontend stderr
├── pm2.log                          # PM2 daemon logs
├── pm2-logrotate-out.log           # Logrotate output
└── pm2-logrotate-error.log         # Logrotate errors
```

### Log Rotation
- **Max Size**: 10MB per file
- **Retention**: 7 files maximum
- **Compression**: Enabled (gzip)
- **Date Format**: YYYY-MM-DD_HH-mm-ss
- **Worker Interval**: 30 seconds

## PM2 Logrotate Configuration

### Current Settings
```bash
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:workerInterval 30
pm2 set pm2-logrotate:rotateInterval 0 0 * * *
pm2 set pm2-logrotate:rotateModule true
```

### Configuration Explanation
- **max_size**: Maximum size per log file before rotation
- **retain**: Number of old log files to keep
- **compress**: Compress rotated log files
- **dateFormat**: Format for rotated log file names
- **workerInterval**: How often to check for rotation (seconds)
- **rotateInterval**: Cron expression for time-based rotation
- **rotateModule**: Rotate PM2 module logs as well

## Log Management Best Practices

### 1. Regular Monitoring
```bash
# Check PM2 status regularly
pm2 status

# Monitor disk usage
du -sh ~/.pm2/logs/

# Check log file sizes
ls -lh ~/.pm2/logs/
```

### 2. Log Search and Debugging
```bash
# Search for errors
pm2 logs --lines 1000 | grep -i error

# Search for specific patterns
pm2 logs animemacker-backend --lines 500 | grep "database"

# Monitor real-time for issues
pm2 logs animemacker-backend --lines 0
```

### 3. Log Cleanup
```bash
# Clear old logs when needed
pm2 flush

# Check logrotate status
pm2 conf pm2-logrotate

# Restart logrotate if needed
pm2 restart pm2-logrotate
```

## Custom Scripts Usage

### Monitor Script (scripts/monitor.sh)
```bash
# Show all information
./scripts/monitor.sh

# Show specific information
./scripts/monitor.sh status
./scripts/monitor.sh logs
./scripts/monitor.sh disk
./scripts/monitor.sh db
./scripts/monitor.sh ports
```

### Logs Script (scripts/logs.sh)
```bash
# Show help
./scripts/logs.sh help

# Real-time logs
./scripts/logs.sh realtime

# Show specific app logs
./scripts/logs.sh show animemacker-backend 50

# Search logs
./scripts/logs.sh search "error" animemacker-backend

# Clear logs
./scripts/logs.sh clear

# Show log statistics
./scripts/logs.sh stats
```

## Troubleshooting

### Common Issues

1. **Logs Not Rotating**
   ```bash
   # Check logrotate status
   pm2 conf pm2-logrotate
   
   # Restart logrotate
   pm2 restart pm2-logrotate
   ```

2. **Disk Space Issues**
   ```bash
   # Check disk usage
   du -sh ~/.pm2/logs/
   
   # Clear old logs
   pm2 flush
   ```

3. **Log Search Not Working**
   ```bash
   # Use grep for better search
   pm2 logs --lines 1000 | grep "search_term"
   ```

### Debug Commands
```bash
# Check PM2 processes
pm2 list

# Check PM2 daemon logs
pm2 logs PM2

# Check logrotate logs
pm2 logs pm2-logrotate

# Check system resources
pm2 monit
```

## Integration with MCP

### Memory Storage
PM2 logger management information disimpan dalam MCP memory untuk:
- Quick reference commands
- Best practices
- Troubleshooting guides
- Configuration settings

### Usage in Development
```bash
# Quick status check
npm run monitor:status

# Search for specific issues
npm run logs:search "error"

# Monitor real-time
npm run logs:realtime

# Clear logs when needed
npm run logs:clear
```

## Benefits

1. **Automatic Log Rotation** - Prevents disk space issues
2. **Centralized Logging** - All logs in one place
3. **Search Capabilities** - Easy debugging and troubleshooting
4. **Real-time Monitoring** - Live log streaming
5. **Custom Scripts** - Automated monitoring and management
6. **Production Ready** - Scalable logging solution

## Next Steps

1. Set up log aggregation (ELK Stack, Graylog)
2. Implement log alerting system
3. Add performance monitoring
4. Set up automated backups
5. Implement health check endpoints

---

**Note**: PM2 Logger Management system telah diimplementasikan dan siap digunakan untuk development dan production environments.
