/**
 * Copy Assets Script
 * Automatically copies all files from src/posts/assets/ to public/assets/
 * This ensures PDFs and images are included in the build and deployed to GitHub Pages
 */

const fs = require('fs');
const path = require('path');

const srcAssetsDir = path.join(__dirname, '../src/posts/assets');
const publicAssetsDir = path.join(__dirname, '../public/assets');

// Create public/assets directory if it doesn't exist
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
  console.log(`✓ Created ${publicAssetsDir}`);
}

// Copy all files from src/posts/assets to public/assets
if (fs.existsSync(srcAssetsDir)) {
  const files = fs.readdirSync(srcAssetsDir);

  files.forEach(file => {
    const srcPath = path.join(srcAssetsDir, file);
    const destPath = path.join(publicAssetsDir, file);

    // Skip directories, only copy files
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${file}`);
    }
  });

  console.log(`\n✓ All assets copied successfully to public/assets/`);
} else {
  console.warn(`⚠ Warning: ${srcAssetsDir} does not exist`);
}

