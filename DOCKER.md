# 🐳 Docker Deployment Guide

This guide covers everything you need to know about deploying your Home Server Photo Gallery with Docker.

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd home_server

# 2. Start the server
docker-compose up -d

# 3. Access your gallery
# Local: http://localhost:3000
# Network: http://[YOUR_IP]:3000
```

## 📁 What Gets Created

When you run `docker-compose up -d`, Docker will:

- ✅ Build the application container
- ✅ Create persistent volumes for:
  - `./database` → Database files
  - `./uploads` → Uploaded photos
- ✅ Expose port 3000
- ✅ Set up health checks
- ✅ Configure auto-restart

## 🔧 Docker Commands

### Basic Operations
```bash
# Start server
docker-compose up -d

# View logs
docker-compose logs -f

# Stop server
docker-compose down

# Restart server
docker-compose restart
```

### Updates
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Maintenance
```bash
# View container status
docker-compose ps

# Access container shell
docker-compose exec home-server sh

# View container logs
docker-compose logs home-server
```

## 🌐 Network Access

### Finding Your IP Address
```bash
# Linux/macOS
hostname -I | awk '{print $1}'

# Windows
ipconfig | findstr "IPv4"
```

### Access URLs
- **Local**: `http://localhost:3000`
- **Network**: `http://[YOUR_IP]:3000`

## 🔒 Security

### For Home Use
- ✅ Only accessible on local network
- ✅ No external internet access required
- ✅ Simple setup, no complex security needed

### Firewall Configuration
```bash
# Ubuntu/Debian
sudo ufw allow 3000

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## 📱 Mobile Access

### From Mobile Devices
1. Connect to the same WiFi network
2. Open browser
3. Navigate to `http://[YOUR_IP]:3000`
4. Upload and view photos

### Creating a Home Screen Shortcut
**iOS:**
1. Open Safari
2. Navigate to your server
3. Tap Share → Add to Home Screen

**Android:**
1. Open Chrome
2. Navigate to your server
3. Menu → Add to Home Screen

## 🔄 Updates

### Updating the Server
```bash
# 1. Pull latest changes
git pull

# 2. Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Data Persistence
Your data is safe during updates because:
- Database is stored in `./database/` volume
- Photos are stored in `./uploads/` volume
- These volumes persist across container restarts

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Find what's using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

**Container won't start:**
```bash
# Check logs
docker-compose logs

# Rebuild container
docker-compose down
docker-compose up -d --build
```

**Can't access from network:**
1. Check firewall settings
2. Verify IP address
3. Ensure devices are on same network

### Getting Help

1. Check container logs: `docker-compose logs -f`
2. Verify network connectivity
3. Check firewall settings
4. Ensure Docker is running

## 📊 Monitoring

### Health Checks
The container includes automatic health checks:
- Server responds to `/ping` endpoint
- Database is accessible
- Upload directory is writable

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs home-server

# View last 100 lines
docker-compose logs --tail=100 home-server
```

## 🗂️ File Structure

```
home_server/
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Container definition
├── .dockerignore        # Files to ignore in build
├── database/            # SQLite database (persistent)
├── uploads/             # Uploaded photos (persistent)
└── src/                 # Application source code
```

## 🔧 Customization

### Changing Port
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your preferred port
```

### Environment Variables
Create a `.env` file:
```bash
PORT=3000
NODE_ENV=production
```

Then reference it in `docker-compose.yml`:
```yaml
environment:
  - PORT=${PORT}
  - NODE_ENV=${NODE_ENV}
```
