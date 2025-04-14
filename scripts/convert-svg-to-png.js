const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convertSvgToPng() {
  const svgDir = path.join(__dirname, '../public/images/testimonials');
  const files = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));
  
  console.log(`Found ${files.length} SVG files to convert`);
  
  for (const file of files) {
    const svgPath = path.join(svgDir, file);
    const pngPath = path.join(svgDir, file.replace('.svg', '.png'));
    
    console.log(`Converting ${file} to PNG...`);
    
    try {
      const svgBuffer = fs.readFileSync(svgPath);
      
      await sharp(svgBuffer)
        .resize(200, 200)
        .png()
        .toFile(pngPath);
      
      console.log(`✓ Created ${file.replace('.svg', '.png')}`);
    } catch (error) {
      console.error(`Error converting ${file}:`, error.message);
    }
  }
  
  console.log('\nConversion complete!');
}

convertSvgToPng();
