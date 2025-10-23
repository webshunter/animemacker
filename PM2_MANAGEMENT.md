# PM2 Project Management & Logging System

## Overview
Sistem manajemen project dengan PM2 yang telah dikonfigurasi dengan logging yang optimal untuk project Anime Scene Director AI.

## Features

### 1. PM2 Log Rotation
- **Module**: `pm2-logrotate` v3.0.0
- **Max Size**: 10MB per log file
- **Retain**: 7 files
- **Compression**: Enabled
- **Date Format**: YYYY-MM-DD_HH-mm-ss
- **Worker Interval**: 30 seconds

### 2. Monitoring Scripts

#### `scripts/monitor.sh`
Script untuk monitoring project secara menyeluruh.

**Usage:**
```bash
npm run monitor                    # Show all information
npm run monitor:status            # Show PM2 status only
npm run monitor:logs              # Show recent logs
npm run monitor:disk              # Show disk usage
```

**Features:**
- PM2 status monitoring
- Recent logs display
- Disk usage analysis
- Database status check
- Port status verification

#### `scripts/logs.sh`
Script untuk manajemen log yang advanced.

**Usage:**
```bash
npm run log-manager               # Show help
npm run logs:realtime            # Show real-time logs
npm run logs:clear               # Clear all PM2 logs
npm run logs:search "error"      # Search logs for specific term
```

**Features:**
- Real-time log streaming
- Log search functionality
- Log file management
- Log statistics
- Log clearing

### 3. Available NPM Scripts

```json
{
  "monitor": "bash scripts/monitor.sh",
  "log-manager": "bash scripts/logs.sh",
  "monitor:status": "bash scripts/monitor.sh status",
  "monitor:logs": "bash scripts/logs.sh show",
  "monitor:disk": "bash scripts/monitor.sh disk",
  "logs:realtime": "bash scripts/logs.sh realtime",
  "logs:clear": "bash scripts/logs.sh clear",
  "logs:search": "bash scripts/logs.sh search"
}
```

## File Storage System

### Backend Changes
- **Multer Integration**: File upload handling
- **Storage Location**: `storage/images/`
- **File Naming**: `scene-{timestamp}-{random}.{ext}`
- **Size Limit**: 10MB per file
- **File Types**: Images only (png, jpeg, webp)

### Database Schema
```sql
CREATE TABLE scenes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  video_prompt TEXT NOT NULL,
  generatedImage TEXT,
  image_filename TEXT,  -- New field for file storage
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints
- `POST /api/scenes/:id/image` - Upload scene image file
- `GET /api/images/:filename` - Serve uploaded images

## Log Management

### PM2 Logrotate Configuration
```bash
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:workerInterval 30
```

### Log Locations
- **PM2 Logs**: `~/.pm2/logs/`
- **Project Logs**: `./logs/`
- **Storage**: `./storage/images/`

## Usage Examples

### 1. Monitor Project Health
```bash
npm run monitor
```

### 2. Check Specific Logs
```bash
npm run monitor:logs animemacker-backend 20
```

### 3. Search for Errors
```bash
npm run logs:search "error" animemacker-backend
```

### 4. Real-time Log Monitoring
```bash
npm run logs:realtime
```

### 5. Clear Old Logs
```bash
npm run logs:clear
```

## Troubleshooting

### Common Issues

1. **File Upload 404 Error**
   - Check if multer is properly configured
   - Verify route order in server.js
   - Ensure storage directory exists

2. **Log Rotation Not Working**
   - Check pm2-logrotate status: `pm2 conf pm2-logrotate`
   - Restart pm2-logrotate: `pm2 restart pm2-logrotate`

3. **Disk Space Issues**
   - Run: `npm run monitor:disk`
   - Clear old logs: `npm run logs:clear`

### Debug Commands
```bash
# Check PM2 status
pm2 status

# Check logrotate configuration
pm2 conf pm2-logrotate

# Check disk usage
du -sh ~/.pm2/logs/
du -sh ./storage/

# Check port status
netstat -tlnp | grep :5552
netstat -tlnp | grep :5551
```

## Benefits

1. **Automated Log Management**: Prevents disk space issues
2. **Centralized Monitoring**: Easy project health checks
3. **File Storage**: Efficient image storage system
4. **Search Capabilities**: Quick error detection
5. **Real-time Monitoring**: Live log streaming
6. **Production Ready**: Optimized for server deployment

## Next Steps

1. Set up log aggregation service (ELK Stack, Graylog)
2. Implement log alerting system
3. Add performance monitoring
4. Set up automated backups
5. Implement health check endpoints

