const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Movie posters from TMDB via images.weserv.nl proxy (CORS-free)
// Format: 'filename.jpg': 'TMDB image URL or fallback Unsplash URL'
const downloads = {
    'deadpool_wolverine.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/8cdWv65xpTM51wE6a04j6O7Zf5K.jpg&output=jpg&quality=90',
    'inside_out_2.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/vpnVM9B6pxm68voNM5JTtFuWIEQ.jpg&output=jpg&quality=90',
    'furiosa.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/iADOnt612viCHuKQj8tG3s5T266.jpg&output=jpg&quality=90',
    'oppenheimer.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/8Gxv8gS681w7dO4w9bBrSY17c42.jpg&output=jpg&quality=90',
    'kalki.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/tuwF471W3bDTUr4t02wGv252vlu.jpg&output=jpg&quality=90',
    'fighter.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/z5CC245tOCe72vYr9nw9cs5X36f.jpg&output=jpg&quality=90',
    'jawan.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/144aW4rT73Kz0a7Zg6xS4o8U1e0.jpg&output=jpg&quality=90',
    'animal.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/68JU5mU527jCkuwCC9nE137f4ae.jpg&output=jpg&quality=90',
    'dunki.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/khPzH2dOdfU3H2r5m9wK6A9dK6q.jpg&output=jpg&quality=90',
    'spiderman.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/r54UBcUBzQ8v9J8e2d4Vd5h8xK4.jpg&output=jpg&quality=90',
    'king.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/d5r5eP34hF68yJ7gD5W8W6iK8kP.jpg&output=jpg&quality=90',
    'avengers.jpg': 'https://images.weserv.nl/?url=image.tmdb.org/t/p/w500/7WsyCh2kWFLgzI7Ice3LaEXHT68.jpg&output=jpg&quality=90'
};

const imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const req = protocol.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                console.warn(`Warning: ${filename} - Status ${res.statusCode}`);
                return resolve(`Skipped ${filename} - Status ${res.statusCode}`);
            }
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✓ Downloaded: ${path.basename(filename)}`);
                resolve();
            });
        });
        req.on('error', (err) => {
            console.error(`✗ Error downloading ${filename}:`, err.message);
            resolve();
        });
        req.setTimeout(10000);
    });
}

async function run() {
    console.log('Starting movie poster downloads...\n');
    for (const [filename, url] of Object.entries(downloads)) {
        const filepath = path.join(imgDir, filename);
        await downloadImage(url, filepath);
    }
    console.log('\n✓ Movie poster downloads completed!');
    console.log('Update movies.js to reference these local image files.');
}

run().catch(console.error);
