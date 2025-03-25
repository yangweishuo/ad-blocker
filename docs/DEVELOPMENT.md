# 开发文档

## 项目概述

Ad Blocker Pro 是一个基于 Chrome Manifest V3 开发的广告拦截扩展，提供全面的广告拦截和隐私保护功能。本文档旨在帮助开发者理解和参与项目开发。

## 开发环境

### 必需工具
- Chrome 浏览器 (v88 或更高版本)
- 代码编辑器 (推荐 VS Code)
- Git 版本控制

### 推荐工具
- Chrome DevTools
- ESLint (代码检查)
- Prettier (代码格式化)

## 项目结构

```
ad-blocker-pro/
├── src/
│   ├── css/          # 样式文件
│   │   ├── popup.css    # 弹出窗口样式
│   │   └── content.css  # 内容脚本样式
│   ├── js/           # JavaScript 文件
│   │   ├── background.js # 后台服务工作者
│   │   ├── popup.js     # 弹出窗口逻辑
│   │   └── content.js   # 内容脚本
│   └── images/       # 图片资源
├── docs/             # 项目文档
├── manifest.json     # 扩展配置文件
└── README.md         # 项目说明文档
```

## 开发指南

### 1. 环境设置

1. 克隆项目
```bash
git clone https://github.com/yourusername/ad-blocker-pro.git
cd ad-blocker-pro
```

2. 安装依赖
```bash
npm install
```

3. 加载扩展
- 打开 Chrome 扩展管理页面 (chrome://extensions/)
- 开启开发者模式
- 点击"加载已解压的扩展程序"
- 选择项目目录

### 2. 开发流程

1. 创建特性分支
```bash
git checkout -b feature/your-feature-name
```

2. 开发新功能
- 遵循代码规范
- 编写单元测试
- 更新文档

3. 提交更改
```bash
git add .
git commit -m "feat: add new feature"
```

4. 推送到远程
```bash
git push origin feature/your-feature-name
```

5. 创建 Pull Request
- 描述功能变更
- 添加测试结果
- 请求代码审查

## 代码规范

### JavaScript

- 使用 ES6+ 特性
- 使用 const 和 let 声明变量
- 使用箭头函数
- 使用 async/await 处理异步
- 使用 JSDoc 注释

示例：
```javascript
/**
 * 处理网络请求
 * @param {string} url - 请求URL
 * @returns {Promise<boolean>} 是否应该拦截
 */
const handleRequest = async (url) => {
  try {
    const shouldBlock = await checkRules(url);
    return shouldBlock;
  } catch (error) {
    console.error('Error handling request:', error);
    return false;
  }
};
```

### CSS

- 使用 CSS 变量定义主题
- 采用 BEM 命名规范
- 使用 flexbox 和 grid 布局
- 添加响应式设计
- 优化动画性能

示例：
```css
:root {
  --primary-color: #4CAF50;
  --text-color: #333;
  --bg-color: #fff;
}

.block {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.block__element {
  margin: 0.5rem;
}

.block--modifier {
  background-color: var(--bg-color);
}
```

## 调试指南

### 1. 后台调试

1. 在扩展管理页面点击"Service Worker"
2. 使用 Chrome DevTools 调试
3. 查看控制台输出
4. 使用断点调试

### 2. 弹出窗口调试

1. 右键点击扩展图标
2. 选择"检查弹出内容"
3. 使用 DevTools 调试
4. 测试交互功能

### 3. 内容脚本调试

1. 在目标页面打开 DevTools
2. 查看 Console 面板
3. 使用 Sources 面板调试
4. 测试 DOM 操作

## 测试

### 单元测试

使用 Jest 运行测试：
```bash
npm test
```

### 集成测试

1. 手动测试功能
2. 检查性能指标
3. 验证规则匹配
4. 测试边界情况

## 发布流程

1. 更新版本号
2. 更新更新日志
3. 构建生产版本
4. 提交到 Chrome Web Store

## 常见问题

### 1. 规则更新失败

检查网络连接和规则源 URL 是否正确。

### 2. 性能问题

- 检查规则数量
- 优化规则匹配算法
- 使用性能分析工具

### 3. 兼容性问题

- 测试不同 Chrome 版本
- 检查 Manifest V3 兼容性
- 验证 API 使用

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 联系方式

- 项目维护者：[your-name]
- 邮箱：[your-email@example.com]
- 问题反馈：[Issues](https://github.com/yourusername/ad-blocker-pro/issues) 