#!/bin/bash

# FB Live Tool - Deployment Script untuk Ubuntu VPS
# Jalankan dengan: bash deploy.sh

set -e

echo "🚀 FB Live Tool - Deployment Script"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Jangan jalankan script ini sebagai root. Gunakan user biasa dengan sudo.${NC}"
   exit 1
fi

echo -e "${GREEN}Step 1: Update system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${GREEN}Step 2: Install Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${YELLOW}Node.js sudah terinstall: $(node --version)${NC}"
fi

echo -e "${GREEN}Step 3: Install FFmpeg...${NC}"
if ! command -v ffmpeg &> /dev/null; then
    sudo apt install -y ffmpeg
else
    echo -e "${YELLOW}FFmpeg sudah terinstall: $(ffmpeg -version | head -n 1)${NC}"
fi

echo -e "${GREEN}Step 4: Install PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    echo -e "${YELLOW}PM2 sudah terinstall: $(pm2 --version)${NC}"
fi

echo -e "${GREEN}Step 5: Install Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    echo -e "${YELLOW}Nginx sudah terinstall${NC}"
fi

echo -e "${GREEN}Step 6: Install npm dependencies...${NC}"
npm install

echo -e "${GREEN}Step 7: Create logs directory...${NC}"
mkdir -p logs

echo -e "${GREEN}Step 8: Create videos directory...${NC}"
mkdir -p videos

echo -e "${GREEN}Step 9: Setup PM2...${NC}"
if pm2 list | grep -q "fb-live-tool"; then
    echo -e "${YELLOW}PM2 process sudah ada, restarting...${NC}"
    pm2 restart fb-live-tool
else
    pm2 start ecosystem.config.js
fi

# Setup PM2 startup
echo -e "${GREEN}Step 10: Setup PM2 startup...${NC}"
STARTUP_CMD=$(pm2 startup | grep -o "sudo.*")
if [ ! -z "$STARTUP_CMD" ]; then
    echo -e "${YELLOW}Jalankan command berikut untuk setup auto-start:${NC}"
    echo -e "${YELLOW}$STARTUP_CMD${NC}"
    echo -e "${YELLOW}Kemudian jalankan: pm2 save${NC}"
fi

echo -e "${GREEN}Step 11: Setup Nginx...${NC}"
read -p "Masukkan domain atau IP VPS Anda (tekan Enter untuk skip): " DOMAIN

if [ -z "$DOMAIN" ]; then
    DOMAIN="localhost"
fi

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/fb-live-tool
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/fb-live-tool

# Enable site
if [ ! -L /etc/nginx/sites-enabled/fb-live-tool ]; then
    sudo ln -s /etc/nginx/sites-available/fb-live-tool /etc/nginx/sites-enabled/
fi

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}Step 12: Setup firewall...${NC}"
read -p "Setup UFW firewall? (y/n): " SETUP_FIREWALL
if [ "$SETUP_FIREWALL" = "y" ]; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    echo -e "${YELLOW}Firewall rules added. Enable dengan: sudo ufw enable${NC}"
fi

echo ""
echo -e "${GREEN}======================================"
echo -e "✅ Deployment selesai!${NC}"
echo -e "${GREEN}======================================"
echo ""
echo -e "📊 Status aplikasi:"
pm2 status
echo ""
echo -e "🌐 Akses aplikasi di: http://$DOMAIN"
echo ""
echo -e "📝 Command berguna:"
echo -e "  - Cek logs: ${YELLOW}pm2 logs fb-live-tool${NC}"
echo -e "  - Restart: ${YELLOW}pm2 restart fb-live-tool${NC}"
echo -e "  - Stop: ${YELLOW}pm2 stop fb-live-tool${NC}"
echo ""
echo -e "📖 Untuk setup SSL, lihat DEPLOY.md"
echo ""
