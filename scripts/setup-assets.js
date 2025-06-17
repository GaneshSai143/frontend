const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');

// Create directories if they don't exist
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Placeholder image URLs (using placeholder.com)
const images = {
  'img1.jpg': 'https://placehold.co/800x600/007bff/ffffff?text=School+Building',
  'img2.jpg': 'https://placehold.co/800x600/28a745/ffffff?text=Classroom',
  'img3.jpg': 'https://placehold.co/800x600/dc3545/ffffff?text=Library',
  'school_banner.jpg': 'https://placehold.co/1920x400/343a40/ffffff?text=School+Management+System'
};

// Download images
Object.entries(images).forEach(([filename, url]) => {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    https.get(url, (response) => {
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}:`, err.message);
    });
  }
}); 