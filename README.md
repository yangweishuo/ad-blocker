# Ad Blocker Pro Chrome Extension

一个功能强大的 Chrome 广告拦截扩展，基于 Manifest V3 开发，提供全面的广告拦截和隐私保护功能。

## 功能特性

### 核心功能
- 🛡️ 强大的广告拦截能力
- 🔄 每日自动更新 EasyList 规则
- ⚡ 高性能的规则匹配引擎
- 🎯 支持自定义拦截规则
- ⚪ 白名单功能
- 📊 详细的统计信息
- 📈 性能监控

### 规则管理
- 支持正则表达式和 CSS 选择器规则
- 内置默认拦截规则（广告、跟踪器、钓鱼网站等）
- 规则导入/导出功能
- 多规则源支持
- 规则源状态监控

### 用户界面
- 🎨 现代化的 Material Design 风格
- 📱 响应式设计
- 🔄 流畅的动画效果
- 📊 直观的数据可视化
- ⚙️ 简洁的设置界面

## 技术栈

- HTML5
- CSS3 (使用 CSS 变量实现主题定制)
- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Service Worker
- Chrome Storage API

## 项目结构

```
ad-blocker-pro/
├── src/
│   ├── css/          # 样式文件
│   ├── js/           # JavaScript 文件
│   └── images/       # 图片资源
├── docs/             # 项目文档
├── manifest.json     # 扩展配置文件
└── README.md         # 项目说明文档
```

## 安装说明

1. 下载或克隆本项目
2. 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目文件夹

## 开发说明

### 环境要求
- Chrome 浏览器 (v88 或更高版本)
- 现代代码编辑器 (推荐 VS Code)

### 开发流程
1. 克隆项目
2. 安装依赖
3. 修改代码
4. 在 Chrome 中重新加载扩展
5. 测试功能

### 调试方法
1. 在扩展管理页面点击"检查视图"
2. 使用 Chrome DevTools 进行调试
3. 查看 Service Worker 日志

## 更新日志

### v1.0.0 (2025-03-25)
- 初始版本发布
- 实现基础广告拦截功能
- 添加规则管理功能
- 实现白名单功能
- 添加性能监控
- 优化用户界面

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至：[yangweishuo297@gamil.com] 
