# Safe Log Reading for MCP - AI Agent Protection

## Overview
Guide untuk membaca log yang aman untuk MCP agar AI agent tidak stuck karena membaca log yang tidak berakhir atau stream.

## ⚠️ **Masalah yang Diatasi:**
- AI agent stuck karena infinite streaming logs
- Memory overflow dari log yang terlalu besar
- Timeout issues saat membaca log
- Hanging operations yang tidak berakhir

## 🛡️ **Safety Features yang Diimplementasikan:**

### 1. Timeout Protection
```bash
# Selalu gunakan timeout untuk prevent hanging
timeout 10s pm2 logs --lines 50 --nostream
timeout 15s pm2 logs app-name --lines 100 --nostream
timeout 20s pm2 logs | grep "error" | head -20
```

### 2. Line Limits
```bash
# Set maximum lines untuk prevent memory overflow
pm2 logs --lines 50 --nostream    # Safe untuk quick checks
pm2 logs --lines 100 --nostream   # Safe untuk detailed checks
pm2 logs --lines 1000 --nostream  # Maximum safe limit
```

### 3. Always Use --nostream
```bash
# SELALU gunakan --nostream untuk prevent infinite streaming
pm2 logs --lines 50 --nostream    # ✅ SAFE
pm2 logs --lines 50               # ❌ DANGEROUS - bisa infinite stream
```

### 4. Output Filtering
```bash
# Gunakan head/tail untuk limit output
pm2 logs --lines 1000 --nostream | head -50
pm2 logs --lines 1000 --nostream | tail -50
pm2 logs --lines 1000 --nostream | grep "error" | head -20
```

## 🔒 **Safe Log Reading Commands**

### Basic Safe Commands
```bash
# Safe log reading dengan limit
npm run safe-logs:read animemacker-backend 50

# Safe log search dengan timeout
npm run safe-logs:search "error" animemacker-backend 100

# Safe error detection
npm run safe-logs:errors animemacker-frontend 30

# Safe log statistics
npm run safe-logs:stats

# Safe log size check
npm run safe-logs:size
```

### Advanced Safe Commands
```bash
# Safe log reading dengan custom timeout
bash scripts/safe-logs.sh read animemacker-backend 100 15

# Safe log search dengan custom timeout
bash scripts/safe-logs.sh search "database" animemacker-backend 200 20

# Safe error detection dengan custom timeout
bash scripts/safe-logs.sh errors animemacker-frontend 50 10
```

## 📋 **Safety Parameters**

### Default Safety Limits
- **Default Lines**: 50 lines
- **Maximum Lines**: 1000 lines
- **Default Timeout**: 10 seconds
- **Maximum Timeout**: 30 seconds
- **Output Limit**: 20 lines untuk search results

### Timeout Recommendations
- **Quick Checks**: 5-10 seconds
- **Detailed Analysis**: 15-20 seconds
- **Search Operations**: 20-30 seconds
- **Never exceed**: 30 seconds

## 🚨 **Dangerous Patterns to Avoid**

### ❌ **NEVER DO THESE:**
```bash
# Infinite streaming - AI agent akan stuck
pm2 logs

# No timeout protection - bisa hang forever
pm2 logs --lines 10000

# No output limits - memory overflow
pm2 logs --lines 1000 | grep "error"

# No --nostream flag - infinite streaming
pm2 logs app-name --lines 50
```

### ✅ **ALWAYS DO THESE:**
```bash
# Use timeout protection
timeout 10s pm2 logs --lines 50 --nostream

# Use reasonable line limits
pm2 logs --lines 50 --nostream

# Use output filtering
pm2 logs --lines 100 --nostream | head -20

# Use --nostream flag
pm2 logs app-name --lines 50 --nostream
```

## 🛠️ **Safe Log Reading Scripts**

### 1. scripts/safe-logs.sh
```bash
# Comprehensive safe log reading
bash scripts/safe-logs.sh read [app] [lines] [timeout]
bash scripts/safe-logs.sh search "term" [app] [lines] [timeout]
bash scripts/safe-logs.sh errors [app] [lines] [timeout]
bash scripts/safe-logs.sh size [app]
bash scripts/safe-logs.sh stats [app]
bash scripts/safe-logs.sh clear [confirm]
```

### 2. Updated scripts/logs.sh
```bash
# Enhanced dengan safety features
npm run logs:realtime    # Now with 30s timeout
npm run logs:search      # Now with 20s timeout and output limits
npm run monitor:logs     # Now with 15s timeout
```

## 📊 **MCP Memory Storage**

### Safety Patterns Stored in MCP:
- **Safe Log Reading for MCP** - Best practices
- **MCP Log Reading Commands** - Safe command reference
- **Log Reading Safety Patterns** - Implementation patterns
- **MCP Log Reading Scripts** - Script collection

### Quick Reference from MCP:
```bash
# Quick safe commands
npm run safe-logs:read
npm run safe-logs:search "error"
npm run safe-logs:errors
npm run safe-logs:stats
npm run safe-logs:size
```

## 🔧 **Implementation Examples**

### Example 1: Safe Error Detection
```bash
# Safe way to check for errors
timeout 15s pm2 logs animemacker-backend --lines 100 --nostream | \
grep -i "error\|exception\|failed" | head -10
```

### Example 2: Safe Log Search
```bash
# Safe way to search logs
timeout 20s pm2 logs animemacker-frontend --lines 500 --nostream | \
grep -i "database" | head -20
```

### Example 3: Safe Log Statistics
```bash
# Safe way to get log statistics
timeout 10s pm2 logs --lines 0 --nostream | wc -l
```

## 🎯 **Best Practices Summary**

1. **Always use timeout** - Prevent hanging operations
2. **Always use --nostream** - Prevent infinite streaming
3. **Set reasonable line limits** - Prevent memory overflow
4. **Use output filtering** - Limit output size
5. **Implement safety checks** - Validate parameters
6. **Use safe scripts** - Leverage pre-built safety features
7. **Monitor execution time** - Set maximum execution limits
8. **Handle errors gracefully** - Implement proper error handling

## 🚀 **Benefits**

- ✅ **AI Agent Protection** - Prevents getting stuck
- ✅ **Memory Safety** - Prevents memory overflow
- ✅ **Timeout Protection** - Prevents hanging operations
- ✅ **Output Control** - Limits output size
- ✅ **Error Handling** - Graceful error management
- ✅ **Performance** - Faster and more reliable operations
- ✅ **Scalability** - Works with large log files
- ✅ **Production Ready** - Safe for production use

---

**Status: IMPLEMENTED** - Safe log reading system telah diimplementasikan dan siap digunakan untuk MCP operations! 🔒
