const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

async function generateFavicon() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/beer-icon.svg'));
    
    // Create a directory for temporary PNG files
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Generate PNG files of different sizes
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngBuffers = [];
    
    for (const size of sizes) {
      const pngBuffer = await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer();
      
      // Save the PNG file
      const pngPath = path.join(tempDir, `favicon-${size}.png`);
      fs.writeFileSync(pngPath, pngBuffer);
      
      // Add to the array for ICO generation
      pngBuffers.push(pngBuffer);
    }
    
    // Generate ICO file
    const icoBuffer = await toIco(pngBuffers);
    
    // Save the ICO file
    fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), icoBuffer);
    
    console.log('Favicon generated successfully!');
    
    // Clean up temporary files
    for (const size of sizes) {
      fs.unlinkSync(path.join(tempDir, `favicon-${size}.png`));
    }
    fs.rmdirSync(tempDir);
    
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
