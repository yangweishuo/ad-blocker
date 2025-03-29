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
    'manifest.json',
    'popup.html',
    'background.js',
    'content.js',
    'rules.json',
    'css/popup.css',
    'css/hot-search.css',
    'js/popup.js',
    'js/hot-search.js',
    'images/icon16.png',
    'images/icon48.png',
    'images/icon128.png'
];

const distDir = path.join(__dirname, 'dist');

function checkFiles() {
    console.log('Checking required files...\n');
    
    requiredFiles.forEach(file => {
        const filePath = path.join(distDir, file);
        if (fs.existsSync(filePath)) {
            console.log(`✓ Found: ${file}`);
        } else {
            console.log(`✗ Missing: ${file}`);
        }
    });
}

checkFiles(); 