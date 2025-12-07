# 🚀 Panduan Cepat - FB Live Tool

## 📦 Install di Ubuntu VPS

### 1. Upload File ke VPS
```bash
# Via SCP (dari komputer lokal)
scp -r . user@ip-vps:/var/www/fb-live-tool

# Atau via Git
cd /var/www
git clone <repo-url> fb-live-tool
cd fb-live-tool
```

### 2. Jalankan Script Deploy Otomatis
```bash
bash deploy.sh
```

Script akan otomatis:
- ✅ Install Node.js
- ✅ Install FFmpeg
- ✅ Install PM2
- ✅ Install Nginx
- ✅ Setup aplikasi
- ✅ Start dengan PM2

### 3. Manual Setup (Jika Script Gagal)

```bash
# Install dependencies
sudo apt update
sudo apt install -y nodejs ffmpeg nginx
sudo npm install -g pm2

# Install npm packages
npm install

# Start aplikasi
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/fb-live-tool
sudo sed -i "s/your-domain.com/IP-VPS-ANDA/g" /etc/nginx/sites-available/fb-live-tool
sudo ln -s /etc/nginx/sites-available/fb-live-tool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🎬 Cara Menggunakan

### 1. Dapatkan Facebook Stream Key
1. Buka: https://www.facebook.com/creatorstudio
2. Pilih **Live Producer**
3. Klik **Go Live** → **Streaming Software**
4. Salin **Stream Key**

### 2. Upload Video ke Server
```bash
# Upload video ke folder videos/
scp video.mp4 user@ip-vps:/var/www/fb-live-tool/videos/
```

### 3. Mulai Streaming
1. Buka browser: `http://IP-VPS-ANDA`
2. Masukkan:
   - **Stream Key**: (dari Facebook)
   - **Path Video**: `/var/www/fb-live-tool/videos/video.mp4`
   - **Resolusi**: Pilih 720p (disarankan)
3. Klik **Mulai Live**

### 4. Monitor Streaming
- Status akan update otomatis
- Video akan loop selama 24 jam
- Cek log: `pm2 logs fb-live-tool`

## 🔧 Command Penting

```bash
# Cek status aplikasi
pm2 status

# Lihat logs
pm2 logs fb-live-tool

# Restart aplikasi
pm2 restart fb-live-tool

# Stop aplikasi
pm2 stop fb-live-tool

# Cek apakah aplikasi berjalan
curl http://localhost:3000/health
```

## ⚠️ Troubleshooting

### Aplikasi tidak bisa diakses
```bash
# Cek apakah PM2 running
pm2 status

# Cek port 3000
sudo lsof -i :3000

# Restart
pm2 restart fb-live-tool
```

### Streaming tidak jalan
```bash
# Cek log FFmpeg
pm2 logs fb-live-tool | grep ffmpeg

# Pastikan video file ada
ls -lh /var/www/fb-live-tool/videos/

# Test FFmpeg manual
ffmpeg -version
```

### Nginx 502 Error
```bash
# Cek apakah aplikasi berjalan
pm2 status

# Cek Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 📝 Tips

1. **Video Format**: Gunakan MP4 (H.264) untuk kompatibilitas terbaik
2. **Video Size**: Resolusi 720p dengan bitrate 2500k sudah cukup
3. **Bandwidth**: Pastikan VPS memiliki bandwidth minimal 5 Mbps upload
4. **Resource**: Monitor CPU dan RAM usage
5. **Stream Key**: Jangan share Stream Key ke publik

## 🔐 Setup SSL (Opsional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL
sudo certbot --nginx -d domain-anda.com

# Auto-renewal sudah otomatis
```

## 📞 Support

Jika ada masalah:
1. Cek logs: `pm2 logs fb-live-tool`
2. Cek Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Baca `DEPLOY.md` untuk detail lengkap

---

**Selamat streaming! 🎉**
