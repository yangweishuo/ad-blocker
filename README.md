# Ad Blocker Pro 浏览器扩展

一个功能强大的广告拦截浏览器扩展，提供广告拦截、性能监控和隐私保护功能。

## 功能特性

### 1. 广告拦截
- 智能广告拦截
- 自定义拦截规则
- 白名单管理
- 规则导入导出
- 默认规则库

### 2. 性能监控
- 实时 CPU 使用率监控（5分钟更新）
- 内存使用情况追踪（5分钟更新）
- 网络流量统计（5分钟更新）
- 响应时间测量（5分钟更新）
- 性能数据导出
- 趋势分析
- 手动刷新支持

### 3. 隐私保护
- 跟踪器拦截
- 社交媒体追踪器阻止
- 恶意软件防护
- 加密货币挖矿脚本拦截
- 弹窗和重定向防护

### 4. 用户界面
- 现代化卡片式设计
- 实时状态显示
- 一键开关控制
- 性能数据可视化
- 响应式布局
- 最后更新时间显示

## 技术架构

### 前端技术
- HTML5
- CSS3 (使用 CSS 变量和 Flexbox/Grid 布局)
- JavaScript (ES6+)
- WebExtension API

### 主要模块
1. **核心拦截器**
   - 规则匹配引擎
   - 请求过滤系统
   - 白名单管理

2. **性能监控系统**
   - 系统资源监控
   - 网络流量分析
   - 性能数据收集

3. **用户界面**
   - 弹出窗口
   - 设置页面
   - 数据可视化

## 安装说明

1. 克隆项目
```bash
git clone https://github.com/yourusername/ad-blocker-pro.git
```

2. 安装依赖
```bash
npm install
```

3. 构建项目
```bash
npm run build
```

4. 在浏览器中加载扩展
- 打开 Chrome 扩展管理页面 (chrome://extensions/)
- 启用开发者模式
- 点击"加载已解压的扩展程序"
- 选择项目的 `dist` 目录

## 使用说明

### 基本功能
1. **启用/禁用拦截器**
   - 点击扩展图标打开弹出窗口
   - 使用顶部的开关按钮控制拦截器状态

2. **管理规则**
   - 点击"规则"标签查看所有规则
   - 使用"添加规则"按钮创建新规则
   - 导入/导出规则支持批量管理

3. **白名单管理**
   - 在"白名单"标签中添加信任的域名
   - 点击域名旁的删除按钮移除白名单

4. **性能监控**
   - 查看实时系统资源使用情况（5分钟自动更新）
   - 使用刷新按钮手动更新数据
   - 监控网络流量和响应时间
   - 导出性能报告进行分析
   - 查看最后更新时间

### 高级功能
1. **自定义规则**
   - 支持通配符和正则表达式
   - 可设置规则优先级
   - 支持规则分类管理

2. **性能分析**
   - 查看历史性能数据
   - 分析性能趋势
   - 导出详细报告

## 开发指南

### 项目结构
```
src/
├── css/
│   └── popup.css      # 弹出窗口样式
├── js/
│   ├── popup.js       # 弹出窗口逻辑
│   └── background.js  # 后台脚本
├── html/
│   └── popup.html     # 弹出窗口界面
└── manifest.json      # 扩展配置文件
```

### 开发命令
```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm test
```

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 JavaScript Standard Style
- 使用 Prettier 进行代码格式化

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 更新日志

### [1.0.0] - 2025-03-25
- 初始版本发布
- 实现基本广告拦截功能
- 添加性能监控系统
- 完成用户界面设计

## 联系方式

- 项目维护者：[WebVernacular]
- 邮箱：[yangweishuo297@gmail.com]
- 项目链接：[https://github.com/yangweishuo/ad-blocker](https://github.com/yourusername/ad-blocker-pro) 
