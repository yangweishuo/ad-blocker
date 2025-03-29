const fs = require('fs');
const path = require('path');

// 检查并创建必要的目录
const dirs = ['dist', 'dist/images', 'dist/css', 'dist/js'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// 检查图标文件
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
iconFiles.forEach(file => {
    const filePath = path.join('dist/images', file);
    if (!fs.existsSync(filePath)) {
        console.error(`Missing icon file: ${file}`);
        console.log('Please generate icons using generate_icons.html');
    } else {
        console.log(`Found icon file: ${file}`);
    }
});

// 检查其他必要文件
const requiredFiles = [
    'dist/popup.html',
    'dist/css/popup.css',
    'dist/js/popup.js',
    'dist/background.js',
    'dist/content.js',
    'dist/manifest.json'
];

requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.error(`Missing required file: ${file}`);
    } else {
        console.log(`Found required file: ${file}`);
    }
}); 