const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [16, 48, 128];
const sourceFile = path.join(__dirname, '../src/images/icon.svg');
const outputDir = path.join(__dirname, '../src/images');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成不同尺寸的图标
sizes.forEach(size => {
  sharp(sourceFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon${size}.png`))
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
}); 