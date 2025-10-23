// Simple icon generator for HealthMate AI PWA
// Run: npm install --save-dev sharp
// Then: node generate-icons.js

const sharp = require('sharp');

const createIcon = async (size, outputPath) => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#16a085;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#27ae60;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.5}" 
            fill="white" text-anchor="middle" dominant-baseline="middle" 
            font-weight="bold">H</text>
    </svg>
  `;
  
  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    console.log(`✓ Created ${outputPath}`);
  } catch (error) {
    console.error(`✗ Failed to create ${outputPath}:`, error.message);
  }
};

(async () => {
  console.log('🎨 Generating PWA icons for HealthMate AI...\n');
  
  await createIcon(192, 'public/icon-192x192.png');
  await createIcon(512, 'public/icon-512x512.png');
  await createIcon(180, 'public/apple-touch-icon.png');
  
  console.log('\n✅ All icons generated successfully!');
  console.log('📱 Your PWA is ready to be installed!\n');
})();
