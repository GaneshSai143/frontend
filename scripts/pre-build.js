const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, '../src/assets');
const imagesDir = path.join(assetsDir, 'images');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder images if they don't exist
const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'school_banner.jpg'];
images.forEach(image => {
  const imagePath = path.join(imagesDir, image);
  if (!fs.existsSync(imagePath)) {
    // Create a simple placeholder image using a data URL
    const placeholderData = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f8f9fa"/><text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="%236c757d">${image}</text></svg>`;
    fs.writeFileSync(imagePath, placeholderData);
  }
}); 