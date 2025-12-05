/**
 * Script untuk generate PWA icons dari logo sekolah
 * 
 * Cara pakai:
 * 1. Install dependencies: npm install sharp (atau npm install canvas)
 * 2. Run: node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

// Cek apakah menggunakan sharp atau canvas
let sharp;
let Canvas;
let Image;

try {
  sharp = require('sharp');
} catch (e) {
  try {
    Canvas = require('canvas');
    Image = Canvas.Image;
  } catch (e2) {
    console.error('❌ Error: Perlu install sharp atau canvas');
    console.log('📦 Install salah satu:');
    console.log('   npm install sharp');
    console.log('   atau');
    console.log('   npm install canvas');
    process.exit(1);
  }
}

const logoPath = path.join(__dirname, '../public/Logo/logo.png');
const outputDir = path.join(__dirname, '../public');

// Cek apakah logo ada
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo tidak ditemukan di:', logoPath);
  process.exit(1);
}

async function generateIconsWithSharp() {
  try {
    console.log('🔄 Generating PWA icons dengan Sharp...');
    
    // Generate icon-192.png
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-192.png'));
    
    console.log('✅ icon-192.png created');
    
    // Generate icon-512.png
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'icon-512.png'));
    
    console.log('✅ icon-512.png created');
    
    // Generate favicon.ico (32x32)
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));
    
    console.log('✅ favicon.png created');
    console.log('🎉 Semua icon berhasil dibuat!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function generateIconsWithCanvas() {
  try {
    console.log('🔄 Generating PWA icons dengan Canvas...');
    
    const img = new Image();
    img.src = fs.readFileSync(logoPath);
    
    // Generate icon-192.png
    const canvas192 = Canvas.createCanvas(192, 192);
    const ctx192 = canvas192.getContext('2d');
    ctx192.fillStyle = 'transparent';
    ctx192.fillRect(0, 0, 192, 192);
    
    // Calculate size to fit logo
    const scale = Math.min(192 / img.width, 192 / img.height);
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (192 - width) / 2;
    const y = (192 - height) / 2;
    
    ctx192.drawImage(img, x, y, width, height);
    
    const buffer192 = canvas192.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, 'icon-192.png'), buffer192);
    console.log('✅ icon-192.png created');
    
    // Generate icon-512.png
    const canvas512 = Canvas.createCanvas(512, 512);
    const ctx512 = canvas512.getContext('2d');
    ctx512.fillStyle = 'transparent';
    ctx512.fillRect(0, 0, 512, 512);
    
    const scale512 = Math.min(512 / img.width, 512 / img.height);
    const width512 = img.width * scale512;
    const height512 = img.height * scale512;
    const x512 = (512 - width512) / 2;
    const y512 = (512 - height512) / 2;
    
    ctx512.drawImage(img, x512, y512, width512, height512);
    
    const buffer512 = canvas512.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, 'icon-512.png'), buffer512);
    console.log('✅ icon-512.png created');
    
    // Generate favicon.png (32x32)
    const canvas32 = Canvas.createCanvas(32, 32);
    const ctx32 = canvas32.getContext('2d');
    ctx32.fillStyle = 'transparent';
    ctx32.fillRect(0, 0, 32, 32);
    
    const scale32 = Math.min(32 / img.width, 32 / img.height);
    const width32 = img.width * scale32;
    const height32 = img.height * scale32;
    const x32 = (32 - width32) / 2;
    const y32 = (32 - height32) / 2;
    
    ctx32.drawImage(img, x32, y32, width32, height32);
    
    const buffer32 = canvas32.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, 'favicon.png'), buffer32);
    console.log('✅ favicon.png created');
    
    console.log('🎉 Semua icon berhasil dibuat!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Main
if (sharp) {
  generateIconsWithSharp();
} else {
  generateIconsWithCanvas();
}

