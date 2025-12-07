const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let ffmpegProcess = null;
let streamInfo = {
    startTime: null,
    streamKey: null,
    videoPath: null,
    resolution: null
};

function getStatus() {
    if (!ffmpegProcess) return 'STOPPED';
    if (ffmpegProcess.exitCode === null) return 'RUNNING';
    return 'STOPPED';
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

// Get status with details
app.get('/api/status', (req, res) => {
    const status = getStatus();
    const response = {
        status: status,
        streamInfo: status === 'RUNNING' ? streamInfo : null
    };
    
    if (status === 'RUNNING' && streamInfo.startTime) {
        const uptime = Math.floor((Date.now() - streamInfo.startTime) / 1000);
        response.uptime = uptime;
        response.uptimeFormatted = formatUptime(uptime);
    }
    
    res.json(response);
});

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}j ${minutes}m ${secs}d`;
}

// Start streaming
app.post('/api/start', (req, res) => {
    const { streamKey, videoPath, resolution } = req.body;
    
    // Validation
    if (!streamKey || !videoPath) {
        return res.status(400).json({ error: "streamKey dan videoPath wajib" });
    }
    
    if (ffmpegProcess && ffmpegProcess.exitCode === null) {
        return res.status(400).json({ error: "Live sudah berjalan" });
    }
    
    // Check if video file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(400).json({ error: `File video tidak ditemukan: ${videoPath}` });
    }
    
    // Facebook RTMP URL
    const fbUrl = `rtmps://live-api-s.facebook.com:443/rtmp/${streamKey}`;
    
    // Resolution settings
    let size = '1280x720';
    let vb = '2500k';
    if (resolution === '480p') {
        size = '854x480';
        vb = '1200k';
    } else if (resolution === '1080p') {
        size = '1920x1080';
        vb = '4500k';
    }
    
    // FFmpeg arguments for 24/7 streaming with loop
    const args = [
        '-re',                    // Read input at native frame rate
        '-stream_loop', '-1',     // Loop video infinitely
        '-i', videoPath,          // Input video
        '-c:v', 'libx264',        // Video codec
        '-preset', 'veryfast',    // Encoding speed
        '-b:v', vb,               // Video bitrate
        '-s', size,               // Resolution
        '-c:a', 'aac',            // Audio codec
        '-b:a', '128k',           // Audio bitrate
        '-ac', '2',               // Audio channels
        '-ar', '44100',           // Audio sample rate
        '-f', 'flv',              // Output format
        '-flvflags', 'no_duration_filesize', // FLV flags
        fbUrl                     // Facebook RTMP URL
    ];
    
    console.log(`Starting stream: ${videoPath} -> Facebook Live`);
    console.log(`Resolution: ${resolution} (${size})`);
    
    // Spawn FFmpeg process
    ffmpegProcess = spawn('ffmpeg', args);
    
    // Store stream info
    streamInfo = {
        startTime: Date.now(),
        streamKey: streamKey.substring(0, 10) + '...', // Partial key for security
        videoPath: videoPath,
        resolution: resolution
    };
    
    // Log FFmpeg output
    ffmpegProcess.stderr.on('data', (data) => {
        const output = String(data);
        console.log(output);
    });
    
    // Handle process close
    ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);
        ffmpegProcess = null;
        streamInfo = {
            startTime: null,
            streamKey: null,
            videoPath: null,
            resolution: null
        };
    });
    
    // Handle errors
    ffmpegProcess.on('error', (err) => {
        console.error('FFmpeg error:', err);
        if (err.code === 'ENOENT') {
            console.error('FFmpeg tidak ditemukan. Pastikan FFmpeg sudah terinstall.');
        }
        ffmpegProcess = null;
        streamInfo = {
            startTime: null,
            streamKey: null,
            videoPath: null,
            resolution: null
        };
    });
    
    // Give FFmpeg a moment to start
    setTimeout(() => {
        if (ffmpegProcess && ffmpegProcess.exitCode === null) {
            return res.json({ 
                message: "Live streaming dimulai!", 
                status: "RUNNING",
                streamInfo: streamInfo
            });
        } else {
            return res.status(500).json({ error: "Gagal memulai streaming. Periksa log server." });
        }
    }, 2000);
});

// Stop streaming
app.post('/api/stop', (req, res) => {
    if (!ffmpegProcess || ffmpegProcess.exitCode !== null) {
        return res.status(400).json({ error: "Tidak ada live streaming yang berjalan" });
    }
    
    console.log('Stopping stream...');
    ffmpegProcess.kill('SIGINT');
    
    // Wait a bit for graceful shutdown
    setTimeout(() => {
        if (ffmpegProcess && ffmpegProcess.exitCode === null) {
            ffmpegProcess.kill('SIGKILL');
        }
        ffmpegProcess = null;
        streamInfo = {
            startTime: null,
            streamKey: null,
            videoPath: null,
            resolution: null
        };
    }, 3000);
    
    res.json({ message: "Live streaming dihentikan", status: "STOPPED" });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    if (ffmpegProcess) {
        ffmpegProcess.kill('SIGINT');
    }
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    if (ffmpegProcess) {
        ffmpegProcess.kill('SIGINT');
    }
    process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FB Live Tool Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Ready to stream 24/7 to Facebook Live!`);
});