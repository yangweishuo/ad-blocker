const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];
const svgPath = path.join(__dirname, '../src/images/icon.svg');
const outputDir = path.join(__dirname, '../src/images');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成不同尺寸的PNG图标
async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon${size}.png`);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generated ${size}x${size} icon at ${outputPath}`);
    }
    console.log('All icons generated successfully!');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

generateIcons(); 