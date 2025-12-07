# 🚀 Panduan Deploy FB Live Tool ke Ubuntu VPS

Panduan lengkap untuk deploy aplikasi FB Live Tool ke Ubuntu VPS dengan PM2 dan Nginx.

## 📋 Prerequisites

- Ubuntu VPS (18.04 atau lebih baru)
- Akses root atau user dengan sudo
- Domain atau IP VPS (opsional)

## 🔧 Langkah 1: Persiapan Server

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (v18 atau lebih baru)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verifikasi instalasi
```

### 1.3 Install FFmpeg
```bash
sudo apt install -y ffmpeg
ffmpeg -version  # Verifikasi instalasi
```

### 1.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 --version  # Verifikasi instalasi
```

### 1.5 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 📦 Langkah 2: Upload dan Setup Aplikasi

### 2.1 Upload File ke VPS
Gunakan salah satu metode berikut:

**Metode A: Git Clone (Recommended)**
```bash
cd /var/www
sudo git clone <repository-url> fb-live-tool
cd fb-live-tool
```

**Metode B: SCP Upload**
```bash
# Dari komputer lokal
scp -r . user@your-vps-ip:/var/www/fb-live-tool
```

**Metode C: Manual Upload**
- Upload semua file ke `/var/www/fb-live-tool/`

### 2.2 Set Permissions
```bash
cd /var/www/fb-live-tool
sudo chown -R $USER:$USER .
sudo chmod -R 755 .
```

### 2.3 Install Dependencies
```bash
npm install
```

### 2.4 Buat Direktori Logs
```bash
mkdir -p logs
```

## 🎬 Langkah 3: Upload Video

### 3.1 Buat Direktori Video
```bash
mkdir -p videos
```

### 3.2 Upload Video File
```bash
# Upload video menggunakan SCP
scp video.mp4 user@your-vps-ip:/var/www/fb-live-tool/videos/

# Atau gunakan wget/curl jika video ada di URL
cd videos
wget https://example.com/video.mp4
```

**Catatan:** Format video yang didukung: MP4, MOV, AVI, MKV

## ⚙️ Langkah 4: Konfigurasi PM2

### 4.1 Edit ecosystem.config.js (jika perlu)
```bash
nano ecosystem.config.js
```

### 4.2 Start dengan PM2
```bash
pm2 start ecosystem.config.js
```

### 4.3 Setup PM2 untuk Auto-Start
```bash
pm2 startup
# Jalankan command yang ditampilkan (biasanya ada sudo)
pm2 save
```

### 4.4 Cek Status
```bash
pm2 status
pm2 logs fb-live-tool
```

## 🌐 Langkah 5: Konfigurasi Nginx

### 5.1 Edit Nginx Config
```bash
sudo nano /etc/nginx/sites-available/fb-live-tool
```

Copy isi dari `nginx.conf` dan sesuaikan:
- Ganti `your-domain.com` dengan domain atau IP VPS Anda

### 5.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/fb-live-tool /etc/nginx/sites-enabled/
sudo nginx -t  # Test konfigurasi
sudo systemctl reload nginx
```

### 5.3 Setup Firewall (jika menggunakan UFW)
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🔐 Langkah 6: Setup SSL (Opsional tapi Recommended)

### 6.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Generate SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

### 6.3 Auto-Renewal
```bash
sudo certbot renew --dry-run
```

## ✅ Langkah 7: Testing

### 7.1 Test Aplikasi
```bash
# Cek apakah aplikasi berjalan
curl http://localhost:3000/health

# Atau buka browser
http://your-vps-ip
```

### 7.2 Test Streaming
1. Buka website di browser
2. Dapatkan Stream Key dari Facebook Creator Studio
3. Masukkan Stream Key dan path video
4. Klik "Mulai Live"

## 📊 Monitoring dan Maintenance

### Cek Logs
```bash
# PM2 logs
pm2 logs fb-live-tool

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Aplikasi
```bash
pm2 restart fb-live-tool
```

### Stop Aplikasi
```bash
pm2 stop fb-live-tool
```

### Update Aplikasi
```bash
cd /var/www/fb-live-tool
git pull  # Jika menggunakan git
npm install
pm2 restart fb-live-tool
```

## 🔧 Troubleshooting

### FFmpeg tidak ditemukan
```bash
which ffmpeg
# Jika tidak ada, install ulang:
sudo apt install -y ffmpeg
```

### Port 3000 sudah digunakan
```bash
# Cek proses yang menggunakan port 3000
sudo lsof -i :3000
# Edit PORT di ecosystem.config.js atau server.js
```

### Nginx 502 Bad Gateway
```bash
# Pastikan aplikasi berjalan
pm2 status
# Cek log
pm2 logs fb-live-tool
```

### Streaming tidak berjalan
```bash
# Cek log FFmpeg
pm2 logs fb-live-tool | grep ffmpeg
# Pastikan video file ada dan dapat diakses
ls -lh /var/www/fb-live-tool/videos/
```

## 📝 Catatan Penting

1. **Stream Key**: Dapatkan dari Facebook Creator Studio → Live Producer
2. **Video Path**: Gunakan path absolut, contoh: `/var/www/fb-live-tool/videos/video.mp4`
3. **Bandwidth**: Pastikan VPS memiliki bandwidth yang cukup untuk streaming
4. **Resource**: Monitor CPU dan RAM usage, streaming membutuhkan resource cukup besar
5. **24/7 Streaming**: Aplikasi akan loop video secara otomatis

## 🆘 Support

Jika ada masalah, cek:
- PM2 logs: `pm2 logs fb-live-tool`
- Nginx logs: `/var/log/nginx/error.log`
- System logs: `journalctl -u nginx`

---

**Selamat! Aplikasi FB Live Tool Anda sudah siap digunakan! 🎉**
