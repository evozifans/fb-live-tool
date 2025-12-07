# 🎥 FB Live Tool - 24 Jam Streaming Tool

Aplikasi web untuk streaming video ke Facebook Live secara non-stop selama 24 jam dengan interface yang modern dan mudah digunakan.

## ✨ Fitur

- 🎬 Streaming 24 jam non-stop ke Facebook Live
- 🔄 Auto-loop video secara otomatis
- 📱 Interface modern dan responsive
- 🎛️ Pilihan resolusi: 480p, 720p, 1080p
- 📊 Real-time status monitoring
- 🚀 Deploy mudah ke Ubuntu VPS
- ⚡ Powered by FFmpeg dan Node.js

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Streaming**: FFmpeg
- **Process Manager**: PM2
- **Web Server**: Nginx
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript

## 📋 Requirements

- Node.js 14+ 
- FFmpeg
- Ubuntu VPS (18.04+)
- PM2 (untuk production)
- Nginx (untuk production)

## 🚀 Quick Start

### Local Development

1. **Clone repository**
```bash
git clone <repository-url>
cd fb-live-tool-final
```

2. **Install dependencies**
```bash
npm install
```

3. **Pastikan FFmpeg terinstall**
```bash
ffmpeg -version
```

4. **Jalankan aplikasi**
```bash
npm start
```

5. **Buka browser**
```
http://localhost:3000
```

### Production Deployment

Lihat file [DEPLOY.md](./DEPLOY.md) untuk panduan lengkap deployment ke Ubuntu VPS.

**Quick Deploy:**
```bash
bash deploy.sh
```

## 📖 Cara Menggunakan

1. **Dapatkan Facebook Stream Key**
   - Buka [Facebook Creator Studio](https://www.facebook.com/creatorstudio)
   - Pilih "Live Producer"
   - Salin "Stream Key"

2. **Siapkan Video**
   - Upload video ke server (format: MP4, MOV, AVI)
   - Catat path lengkap file video

3. **Mulai Streaming**
   - Masukkan Stream Key
   - Masukkan path video
   - Pilih resolusi
   - Klik "Mulai Live"

4. **Monitor Status**
   - Status akan update otomatis setiap 3 detik
   - Video akan di-loop otomatis selama 24 jam

## 📁 Struktur Project

```
fb-live-tool-final/
├── server.js              # Backend server
├── package.json           # Dependencies
├── ecosystem.config.js    # PM2 configuration
├── nginx.conf            # Nginx configuration
├── deploy.sh             # Deployment script
├── DEPLOY.md             # Deployment guide
├── README.md             # This file
└── public/
    └── index.html        # Frontend interface
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Port server (default: 3000)

### PM2 Configuration

Edit `ecosystem.config.js` untuk mengubah:
- Memory limit
- Log paths
- Environment variables

### Nginx Configuration

Edit `nginx.conf` untuk:
- Domain/IP configuration
- SSL setup
- Proxy settings

## 📊 API Endpoints

- `GET /api/status` - Get streaming status
- `POST /api/start` - Start streaming
- `POST /api/stop` - Stop streaming
- `GET /health` - Health check

## 🐛 Troubleshooting

### FFmpeg tidak ditemukan
```bash
sudo apt install ffmpeg
```

### Port sudah digunakan
Edit `PORT` di `server.js` atau `ecosystem.config.js`

### Streaming tidak berjalan
- Cek log: `pm2 logs fb-live-tool`
- Pastikan video file ada dan dapat diakses
- Verifikasi Stream Key valid

## 📝 Notes

- **Stream Key**: Dapatkan dari Facebook Creator Studio
- **Video Format**: MP4, MOV, AVI (disarankan MP4)
- **Bandwidth**: Pastikan VPS memiliki bandwidth cukup
- **Resource**: Streaming membutuhkan CPU dan RAM cukup besar

## 🔒 Security

- Jangan expose Stream Key di public
- Gunakan HTTPS untuk production
- Setup firewall dengan benar
- Gunakan environment variables untuk sensitive data

## 📄 License

MIT License

## 🤝 Contributing

Pull requests are welcome!

## ⚠️ Disclaimer

Tool ini untuk keperluan edukasi dan testing. Pastikan Anda memiliki hak untuk streaming konten video tersebut.

---

**Made with ❤️ for 24/7 Facebook Live Streaming**
