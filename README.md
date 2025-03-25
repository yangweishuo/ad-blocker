# Ad Blocker Pro

一个基于 Manifest V3 的强大广告拦截 Chrome 扩展。

## 功能特点

- 基于 Manifest V3 开发，确保长期兼容性
- 实时拦截广告请求
- 移除页面中的广告元素
- 可自定义拦截规则
- 统计拦截数据
- 简洁美观的用户界面

## 技术栈

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Webpack 5
- Babel 7
- CSS3
- HTML5

## 项目结构

```
src/
  ├── js/
  │   ├── popup.js      # 弹出窗口脚本
  │   ├── background.js # 后台脚本
  │   └── content.js    # 内容脚本
  ├── css/
  │   └── popup.css     # 弹出窗口样式
  ├── images/           # 图标和图片资源
  └── popup.html        # 弹出窗口 HTML
```

## 安装说明

1. 克隆或下载此仓库
2. 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目目录

## 开发说明

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 功能说明

### 广告拦截

- 基于 URL 模式的广告请求拦截
- 支持自定义拦截规则
- 实时更新拦截状态

### 界面功能

- 启用/禁用广告拦截
- 查看拦截统计信息
- 管理自定义规则
- 白名单管理

### 性能优化

- 使用 Service Worker 进行后台处理
- 优化的规则匹配算法
- 最小化内存占用

## 配置说明

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "Ad Blocker Pro",
  "version": "1.0.0",
  "description": "A powerful ad blocker Chrome extension based on Manifest V3",
  "permissions": [
    "storage",
    "webRequest",
    "webRequestBlocking",
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

### webpack.config.js

```javascript
module.exports = {
  entry: {
    popup: './src/js/popup.js',
    background: './src/js/background.js',
    content: './src/js/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

MIT License

## 更新日志

### v1.0.0 (2025-03-25)
- 初始版本发布
- 实现基础广告拦截功能
- 添加规则管理功能
- 实现白名单功能
- 添加性能监控
- 优化用户界面

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至：[yangweishuo297@gmail.com] 
