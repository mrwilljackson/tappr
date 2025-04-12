const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the directory containing the images
const imagesDir = path.join(__dirname, '../public/images/app');

// Get all PNG files in the directory
const imageFiles = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.png'));

console.log(`Found ${imageFiles.length} PNG files to optimize`);

// Create a directory for optimized images
const optimizedDir = path.join(__dirname, '../public/images/app-optimized');
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Optimize each image
imageFiles.forEach(file => {
  const inputPath = path.join(imagesDir, file);
  const outputPath = path.join(optimizedDir, file);
  
  console.log(`Optimizing ${file}...`);
  
  try {
    // Get original file size
    const originalSize = fs.statSync(inputPath).size;
    
    // Optimize the image using sharp
    execSync(`npx sharp-cli --input="${inputPath}" --output="${outputPath}" --quality=80 --format=png`);
    
    // Get optimized file size
    const optimizedSize = fs.statSync(outputPath).size;
    
    // Calculate size reduction
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`✓ ${file}: ${(originalSize / 1024).toFixed(2)} KB → ${(optimizedSize / 1024).toFixed(2)} KB (${reduction}% reduction)`);
  } catch (error) {
    console.error(`Error optimizing ${file}:`, error.message);
  }
});

console.log('\nOptimization complete! Optimized images are in public/images/app-optimized/');
console.log('To replace the original images with the optimized versions, run:');
console.log('cp public/images/app-optimized/* public/images/app/');
