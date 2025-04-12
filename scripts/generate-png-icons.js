const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generatePngIcons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/beer-icon.svg'));
    
    // Generate PNG files of different sizes
    const sizes = [192, 512];
    
    for (const size of sizes) {
      const pngBuffer = await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer();
      
      // Save the PNG file
      const pngPath = path.join(__dirname, `../public/icons/icon-${size}.png`);
      fs.writeFileSync(pngPath, pngBuffer);
    }
    
    console.log('PNG icons generated successfully!');
    
  } catch (error) {
    console.error('Error generating PNG icons:', error);
  }
}

generatePngIcons();
