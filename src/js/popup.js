import browser from 'webextension-polyfill';
import '../css/popup.css';

// 初始化状态
let isEnabled = true;
let lastUpdateTime = new Date();

// DOM 元素
const elements = {
  statusText: document.querySelector('.status-badge span'),
  statusIcon: document.querySelector('.status-badge i'),
  blockerToggle: document.querySelector('.blocker-toggle input'),
  lastUpdateTime: document.querySelector('.last-update time'),
  adsBlocked: document.getElementById('ads-blocked'),
  dataSaved: document.getElementById('data-saved'),
  timeSaved: document.getElementById('time-saved'),
  ruleList: document.getElementById('rule-list'),
  whitelistInput: document.getElementById('whitelist-input'),
  whitelistList: document.getElementById('whitelist-list'),
  addRuleBtn: document.getElementById('add-rule-btn'),
  defaultRulesBtn: document.getElementById('default-rules-btn'),
  importRulesBtn: document.getElementById('import-rules-btn'),
  exportRulesBtn: document.getElementById('export-rules-btn'),
  addWhitelistBtn: document.getElementById('add-whitelist-btn'),
  settingsLink: document.getElementById('settings-link'),
  helpLink: document.getElementById('help-link'),
  aboutLink: document.getElementById('about-link')
};

// 统计数据
let stats = {
  adsBlocked: 0,
  dataSaved: 0,
  timeSaved: 0
};

// 性能监控数据
let performanceData = {
  cpu: {
    current: 0,
    peak: 0,
    trend: 0
  },
  memory: {
    current: 0,
    peak: 0,
    trend: 0
  },
  network: {
    current: 0,
    peak: 0,
    trend: 0
  },
  responseTime: {
    current: 0,
    peak: 0,
    trend: 0
  }
};

// 默认规则列表
const defaultRules = [
  // 广告网络
  { id: 1, pattern: '*.doubleclick.net/*', enabled: true, category: 'ads' },
  { id: 2, pattern: '*.google-analytics.com/*', enabled: true, category: 'tracking' },
  { id: 3, pattern: '*.facebook.com/*', enabled: true, category: 'social' },
  { id: 4, pattern: '*.adnxs.com/*', enabled: true, category: 'ads' },
  { id: 5, pattern: '*.advertising.com/*', enabled: true, category: 'ads' },
  { id: 6, pattern: '*.adroll.com/*', enabled: true, category: 'ads' },
  { id: 7, pattern: '*.taboola.com/*', enabled: true, category: 'ads' },
  { id: 8, pattern: '*.outbrain.com/*', enabled: true, category: 'ads' },
  
  // 跟踪器
  { id: 9, pattern: '*.hotjar.com/*', enabled: true, category: 'tracking' },
  { id: 10, pattern: '*.mixpanel.com/*', enabled: true, category: 'tracking' },
  { id: 11, pattern: '*.segment.io/*', enabled: true, category: 'tracking' },
  { id: 12, pattern: '*.intercom.io/*', enabled: true, category: 'tracking' },
  
  // 社交媒体
  { id: 13, pattern: '*.twitter.com/*', enabled: true, category: 'social' },
  { id: 14, pattern: '*.linkedin.com/*', enabled: true, category: 'social' },
  { id: 15, pattern: '*.pinterest.com/*', enabled: true, category: 'social' },
  
  // 恶意软件和钓鱼
  { id: 16, pattern: '*.malware.com/*', enabled: true, category: 'security' },
  { id: 17, pattern: '*.phishing.com/*', enabled: true, category: 'security' },
  { id: 18, pattern: '*.spam.com/*', enabled: true, category: 'security' },
  { id: 19, pattern: '*.virus.com/*', enabled: true, category: 'security' },
  { id: 20, pattern: '*.trojan.com/*', enabled: true, category: 'security' },
  { id: 21, pattern: '*.ransomware.com/*', enabled: true, category: 'security' },
  { id: 22, pattern: '*.keylogger.com/*', enabled: true, category: 'security' },
  { id: 23, pattern: '*.botnet.com/*', enabled: true, category: 'security' },
  
  // 加密货币挖矿
  { id: 24, pattern: '*.coinhive.com/*', enabled: true, category: 'crypto' },
  { id: 25, pattern: '*.cryptoloot.pro/*', enabled: true, category: 'crypto' },
  { id: 26, pattern: '*.webminer.com/*', enabled: true, category: 'crypto' },
  { id: 27, pattern: '*.miner.com/*', enabled: true, category: 'crypto' },
  
  // 弹窗和重定向
  { id: 28, pattern: '*.popup.com/*', enabled: true, category: 'popup' },
  { id: 29, pattern: '*.redirect.com/*', enabled: true, category: 'popup' },
  { id: 30, pattern: '*.clickbait.com/*', enabled: true, category: 'popup' },
  
  // 视频广告
  { id: 31, pattern: '*.vimeo.com/*/ads/*', enabled: true, category: 'video' },
  { id: 32, pattern: '*.youtube.com/*/ads/*', enabled: true, category: 'video' },
  
  // 第三方内容
  { id: 33, pattern: '*.cdn.ampproject.org/*', enabled: true, category: 'third-party' },
  { id: 34, pattern: '*.cloudflare.com/*', enabled: true, category: 'third-party' },
  
  // 统计和分析
  { id: 35, pattern: '*.googletagmanager.com/*', enabled: true, category: 'analytics' },
  { id: 36, pattern: '*.optimizely.com/*', enabled: true, category: 'analytics' },
  { id: 37, pattern: '*.segment.io/*', enabled: true, category: 'analytics' },
  
  // 成人内容
  { id: 38, pattern: '*.porn.com/*', enabled: true, category: 'adult' },
  { id: 39, pattern: '*.adult.com/*', enabled: true, category: 'adult' },
  { id: 40, pattern: '*.xxx.com/*', enabled: true, category: 'adult' },
  { id: 41, pattern: '*.sex.com/*', enabled: true, category: 'adult' },
  { id: 42, pattern: '*.nude.com/*', enabled: true, category: 'adult' },
  
  // 赌博网站
  { id: 43, pattern: '*.casino.com/*', enabled: true, category: 'gambling' },
  { id: 44, pattern: '*.bet.com/*', enabled: true, category: 'gambling' },
  { id: 45, pattern: '*.poker.com/*', enabled: true, category: 'gambling' },
  { id: 46, pattern: '*.lottery.com/*', enabled: true, category: 'gambling' },
  
  // 暴力内容
  { id: 47, pattern: '*.violence.com/*', enabled: true, category: 'violence' },
  { id: 48, pattern: '*.gore.com/*', enabled: true, category: 'violence' },
  { id: 49, pattern: '*.blood.com/*', enabled: true, category: 'violence' },
  
  // 其他
  { id: 50, pattern: '*.doubleclick.net/*', enabled: true, category: 'other' },
  { id: 51, pattern: '*.googleadservices.com/*', enabled: true, category: 'other' },
  { id: 52, pattern: '*.googlesyndication.com/*', enabled: true, category: 'other' }
];

// 规则列表
let rules = defaultRules;

// 白名单
let whitelist = [
  'example.com',
  'trusted-site.com'
];

// 更新统计信息
function updateStats() {
  elements.adsBlocked.textContent = stats.adsBlocked.toLocaleString();
  elements.dataSaved.textContent = `${(stats.dataSaved / 1024 / 1024).toFixed(1)} MB`;
  elements.timeSaved.textContent = `${Math.round(stats.timeSaved / 60)} min`;
}

// 更新状态显示
function updateStatus(enabled) {
  isEnabled = enabled;
  elements.statusText.textContent = enabled ? '保护已启用' : '保护已禁用';
  elements.statusIcon.className = enabled ? 'fas fa-shield-alt' : 'fas fa-shield-alt text-muted';
  elements.blockerToggle.checked = enabled;
  
  // 保存状态到存储
  chrome.storage.sync.set({ enabled }, () => {
    console.log('Status saved:', enabled);
  });
}

// 更新最后更新时间
function updateLastUpdateTime() {
  const now = new Date();
  const diff = now - lastUpdateTime;
  
  let timeText = '刚刚';
  if (diff > 60000) {
    timeText = `${Math.floor(diff / 60000)}分钟前`;
  } else if (diff > 1000) {
    timeText = `${Math.floor(diff / 1000)}秒前`;
  }
  
  elements.lastUpdateTime.textContent = timeText;
}

// 创建规则元素
function createRuleElement(rule) {
  const div = document.createElement('div');
  div.className = 'rule-item';
  div.innerHTML = `
    <div class="rule-content">
      <input type="checkbox" ${rule.enabled ? 'checked' : ''}>
      <div class="rule-info">
        <span class="rule-pattern">${rule.pattern}</span>
        <span class="rule-category">${rule.category}</span>
      </div>
    </div>
    <button class="btn btn-sm btn-danger">
      <i class="fas fa-trash"></i>
    </button>
  `;

  // 添加事件监听器
  const checkbox = div.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    rule.enabled = checkbox.checked;
    saveRules();
    updateStatus(rule.enabled);
  });

  const deleteBtn = div.querySelector('button');
  deleteBtn.addEventListener('click', () => {
    rules = rules.filter(r => r.id !== rule.id);
    saveRules();
    renderRules();
  });

  return div;
}

// 渲染规则列表
function renderRules() {
  elements.ruleList.innerHTML = '';
  rules.forEach(rule => {
    elements.ruleList.appendChild(createRuleElement(rule));
  });
}

// 创建白名单元素
function createWhitelistElement(domain) {
  const div = document.createElement('div');
  div.className = 'whitelist-item';
  div.innerHTML = `
    <span class="domain">${domain}</span>
    <button class="btn btn-sm btn-danger">
      <i class="fas fa-times"></i>
    </button>
  `;

  // 添加删除按钮事件监听器
  const deleteBtn = div.querySelector('button');
  deleteBtn.addEventListener('click', () => {
    whitelist = whitelist.filter(d => d !== domain);
    saveWhitelist();
    renderWhitelist();
  });

  return div;
}

// 渲染白名单列表
function renderWhitelist() {
  elements.whitelistList.innerHTML = '';
  whitelist.forEach(domain => {
    elements.whitelistList.appendChild(createWhitelistElement(domain));
  });
}

// 保存规则到存储
function saveRules() {
  chrome.storage.sync.set({ rules }, () => {
    console.log('Rules saved');
  });
}

// 保存白名单到存储
function saveWhitelist() {
  chrome.storage.sync.set({ whitelist }, () => {
    console.log('Whitelist saved');
  });
}

// 导入规则
function importRules() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedRules = JSON.parse(event.target.result);
        rules = [...rules, ...importedRules];
        saveRules();
        renderRules();
      } catch (error) {
        alert('Invalid rules file format');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// 导出规则
function exportRules() {
  const data = JSON.stringify(rules, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ad-blocker-rules.json';
  a.click();
  URL.revokeObjectURL(url);
}

// 添加新规则
function addRule(pattern) {
  if (!pattern) return;
  
  const newRule = {
    id: Date.now(),
    pattern,
    enabled: true,
    category: 'custom'
  };
  rules.push(newRule);
  saveRules();
  renderRules();
  updateStatus(true);
}

// 添加白名单域名
function addToWhitelist(domain) {
  if (!domain || whitelist.includes(domain)) return;
  
  whitelist.push(domain);
  saveWhitelist();
  renderWhitelist();
  elements.whitelistInput.value = '';
}

// 恢复默认规则
function restoreDefaultRules() {
  if (confirm('确定要恢复默认规则吗？这将删除所有自定义规则。')) {
    rules = [...defaultRules];
    saveRules();
    renderRules();
    updateStatus(true);
  }
}

// 初始化
function init() {
  // 从存储加载数据
  chrome.storage.sync.get(['stats', 'rules', 'whitelist', 'enabled'], (result) => {
    if (result.stats) stats = result.stats;
    if (result.rules) {
      // 合并默认规则和用户规则
      const userRules = result.rules.filter(rule => rule.id > defaultRules.length);
      rules = [...defaultRules, ...userRules];
    }
    if (result.whitelist) whitelist = result.whitelist;
    if (result.enabled !== undefined) isEnabled = result.enabled;

    updateStats();
    updateStatus(isEnabled);
    renderRules();
    renderWhitelist();
  });

  // 拦截器开关事件
  elements.blockerToggle.addEventListener('change', (e) => {
    updateStatus(e.target.checked);
  });

  // 性能监控相关事件
  const refreshBtn = document.querySelector('.btn-refresh');
  const exportBtn = document.querySelector('.btn-export');
  const trendBtn = document.querySelector('.details-actions .btn:first-child');
  const filterBtn = document.querySelector('.details-actions .btn:last-child');

  refreshBtn.addEventListener('click', () => {
    simulatePerformanceUpdate();
  });

  exportBtn.addEventListener('click', () => {
    // 导出性能报告
    const report = {
      timestamp: new Date().toISOString(),
      data: performanceData
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  trendBtn.addEventListener('click', () => {
    // TODO: 实现趋势图功能
    console.log('Show trend chart');
  });

  filterBtn.addEventListener('click', () => {
    // TODO: 实现筛选功能
    console.log('Show filter options');
  });

  // 添加规则按钮事件
  elements.addRuleBtn.addEventListener('click', () => {
    const pattern = prompt('输入规则模式 (例如: *.example.com/*):');
    if (pattern) addRule(pattern);
  });

  // 恢复默认规则按钮事件
  elements.defaultRulesBtn.addEventListener('click', restoreDefaultRules);

  // 导入规则按钮事件
  elements.importRulesBtn.addEventListener('click', importRules);

  // 导出规则按钮事件
  elements.exportRulesBtn.addEventListener('click', exportRules);

  // 添加白名单按钮事件
  elements.addWhitelistBtn.addEventListener('click', () => {
    addToWhitelist(elements.whitelistInput.value.trim());
  });

  // 白名单输入框回车事件
  elements.whitelistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addToWhitelist(elements.whitelistInput.value.trim());
    }
  });

  // 设置链接事件
  elements.settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // 帮助链接事件
  elements.helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://example.com/help', '_blank');
  });

  // 关于链接事件
  elements.aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://example.com/about', '_blank');
  });
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);

// 卡片切换功能
document.addEventListener('DOMContentLoaded', () => {
  const navTabs = document.querySelectorAll('.nav-tab');
  const contentCards = document.querySelectorAll('.content-card');

  // 获取当前 URL 的 hash 值，如果没有则默认为 #stats
  const currentHash = window.location.hash || '#stats';

  // 初始化显示对应的卡片
  showContentCard(currentHash.substring(1));

  // 为导航标签添加点击事件
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('href').substring(1);
      showContentCard(targetId);
      
      // 更新 URL hash
      window.location.hash = targetId;
      
      // 更新导航标签状态
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // 监听 URL hash 变化
  window.addEventListener('hashchange', () => {
    const targetId = window.location.hash.substring(1);
    showContentCard(targetId);
    
    // 更新导航标签状态
    navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('href') === `#${targetId}`);
    });
  });

  // 显示指定 ID 的内容卡片
  function showContentCard(targetId) {
    contentCards.forEach(card => {
      if (card.id === targetId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // 设置页面开关按钮事件
  const switches = document.querySelectorAll('.switch input');
  switches.forEach(switch_ => {
    switch_.addEventListener('change', (e) => {
      const setting = e.target.closest('.setting-item').querySelector('.setting-label').textContent;
      const enabled = e.target.checked;
      
      // 这里可以添加保存设置的逻辑
      console.log(`${setting}: ${enabled ? 'enabled' : 'disabled'}`);
    });
  });

  // 性能监控相关事件
  const refreshBtn = document.querySelector('.performance-actions .btn:first-child');
  const exportBtn = document.querySelector('.performance-actions .btn:last-child');

  refreshBtn.addEventListener('click', () => {
    simulatePerformanceUpdate();
  });

  exportBtn.addEventListener('click', () => {
    // 导出性能报告
    const report = {
      timestamp: new Date().toISOString(),
      data: performanceData
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 定期更新性能数据
  let updateInterval;
  const performanceCard = document.getElementById('performance');
  
  // 当性能卡片显示时开始更新，隐藏时停止更新
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('active')) {
        // 开始更新
        updatePerformanceData();
        updateInterval = setInterval(updatePerformanceData, 5 * 60 * 1000); // 5分钟更新一次
      } else {
        // 停止更新
        clearInterval(updateInterval);
      }
    });
  });

  observer.observe(performanceCard, { attributes: true, attributeFilter: ['class'] });
});

// 获取系统性能数据
async function getSystemPerformance() {
  try {
    // 获取 CPU 使用率
    const cpuUsage = await chrome.system.cpu.getInfo();
    const totalUsage = cpuUsage.processors.reduce((acc, proc) => acc + proc.usage.user + proc.usage.kernel, 0);
    const avgUsage = totalUsage / (cpuUsage.processors.length * 100);

    // 获取内存使用情况
    const memoryInfo = await chrome.system.memory.getInfo();
    const usedMemory = (memoryInfo.capacity - memoryInfo.availableCapacity) / (1024 * 1024); // 转换为 MB

    // 获取网络流量
    const networkInfo = await chrome.system.network.getNetworkInterfaces();
    const totalBytes = networkInfo.reduce((acc, iface) => acc + iface.bytesReceived + iface.bytesSent, 0);
    const currentSpeed = totalBytes / (1024 * 1024); // 转换为 MB/s

    // 获取响应时间
    const startTime = performance.now();
    await fetch('https://www.google.com/favicon.ico');
    const responseTime = performance.now() - startTime;

    return {
      cpu: avgUsage * 100, // 转换为百分比
      memory: Math.round(usedMemory),
      network: currentSpeed.toFixed(1),
      responseTime: Math.round(responseTime)
    };
  } catch (error) {
    console.error('Error getting system performance:', error);
    return null;
  }
}

// 更新性能数据
async function updatePerformanceData() {
  const realData = await getSystemPerformance();
  if (!realData) return;

  // 更新当前值
  performanceData.cpu.current = realData.cpu;
  performanceData.memory.current = realData.memory;
  performanceData.network.current = realData.network;
  performanceData.responseTime.current = realData.responseTime;

  // 更新峰值
  performanceData.cpu.peak = Math.max(performanceData.cpu.peak, performanceData.cpu.current);
  performanceData.memory.peak = Math.max(performanceData.memory.peak, performanceData.memory.current);
  performanceData.network.peak = Math.max(performanceData.network.peak, performanceData.network.current);
  performanceData.responseTime.peak = Math.max(performanceData.responseTime.peak, performanceData.responseTime.current);

  // 计算趋势（与上一次相比的变化百分比）
  const prevData = { ...performanceData };
  performanceData.cpu.trend = ((performanceData.cpu.current - prevData.cpu.current) / prevData.cpu.current) * 100;
  performanceData.memory.trend = ((performanceData.memory.current - prevData.memory.current) / prevData.memory.current) * 100;
  performanceData.network.trend = ((performanceData.network.current - prevData.network.current) / prevData.network.current) * 100;
  performanceData.responseTime.trend = ((performanceData.responseTime.current - prevData.responseTime.current) / prevData.responseTime.current) * 100;

  // 更新 UI
  document.querySelector('.performance-card:nth-child(1) .performance-value').textContent = `${performanceData.cpu.current.toFixed(1)}%`;
  document.querySelector('.performance-card:nth-child(1) .chart-bar').style.width = `${(performanceData.cpu.current / 100) * 100}%`;
  
  document.querySelector('.performance-card:nth-child(2) .performance-value').textContent = `${performanceData.memory.current}MB`;
  document.querySelector('.performance-card:nth-child(2) .chart-bar').style.width = `${(performanceData.memory.current / 200) * 100}%`;
  
  document.querySelector('.performance-card:nth-child(3) .performance-value').textContent = `${performanceData.network.current}MB/s`;
  document.querySelector('.performance-card:nth-child(3) .chart-bar').style.width = `${(performanceData.network.current / 3) * 100}%`;
  
  document.querySelector('.performance-card:nth-child(4) .performance-value').textContent = `${performanceData.responseTime.current}ms`;
  document.querySelector('.performance-card:nth-child(4) .chart-bar').style.width = `${(performanceData.responseTime.current / 100) * 100}%`;

  // 更新表格数据
  document.querySelector('.table-row:nth-child(1) span:nth-child(2)').textContent = `${performanceData.cpu.current.toFixed(1)}%`;
  document.querySelector('.table-row:nth-child(1) span:nth-child(3)').textContent = `${performanceData.cpu.peak.toFixed(1)}%`;
  document.querySelector('.table-row:nth-child(1) .trend').innerHTML = `
    <i class="fas fa-arrow-${performanceData.cpu.trend > 0 ? 'up' : performanceData.cpu.trend < 0 ? 'down' : 'minus'}"></i>
    ${Math.abs(performanceData.cpu.trend).toFixed(1)}%
  `;

  document.querySelector('.table-row:nth-child(2) span:nth-child(2)').textContent = `${performanceData.memory.current}MB`;
  document.querySelector('.table-row:nth-child(2) span:nth-child(3)').textContent = `${performanceData.memory.peak}MB`;
  document.querySelector('.table-row:nth-child(2) .trend').innerHTML = `
    <i class="fas fa-arrow-${performanceData.memory.trend > 0 ? 'up' : performanceData.memory.trend < 0 ? 'down' : 'minus'}"></i>
    ${Math.abs(performanceData.memory.trend).toFixed(1)}%
  `;

  document.querySelector('.table-row:nth-child(3) span:nth-child(2)').textContent = `${performanceData.network.current}MB/s`;
  document.querySelector('.table-row:nth-child(3) span:nth-child(3)').textContent = `${performanceData.network.peak}MB/s`;
  document.querySelector('.table-row:nth-child(3) .trend').innerHTML = `
    <i class="fas fa-arrow-${performanceData.network.trend > 0 ? 'up' : performanceData.network.trend < 0 ? 'down' : 'minus'}"></i>
    ${Math.abs(performanceData.network.trend).toFixed(1)}%
  `;

  // 更新最后更新时间
  lastUpdateTime = new Date();
  updateLastUpdateTime();
}

// 模拟性能数据更新
function simulatePerformanceUpdate() {
  // 随机更新数据
  performanceData.cpu.current = Math.max(0, Math.min(10, performanceData.cpu.current + (Math.random() - 0.5) * 2));
  performanceData.memory.current = Math.max(0, Math.min(200, performanceData.memory.current + (Math.random() - 0.5) * 10));
  performanceData.network.current = Math.max(0, Math.min(3, performanceData.network.current + (Math.random() - 0.5) * 0.5));
  performanceData.responseTime.current = Math.max(0, Math.min(100, performanceData.responseTime.current + (Math.random() - 0.5) * 5));

  // 更新峰值
  performanceData.cpu.peak = Math.max(performanceData.cpu.peak, performanceData.cpu.current);
  performanceData.memory.peak = Math.max(performanceData.memory.peak, performanceData.memory.current);
  performanceData.network.peak = Math.max(performanceData.network.peak, performanceData.network.current);
  performanceData.responseTime.peak = Math.max(performanceData.responseTime.peak, performanceData.responseTime.current);

  // 更新趋势
  performanceData.cpu.trend = (Math.random() - 0.5) * 2;
  performanceData.memory.trend = (Math.random() - 0.5) * 2;
  performanceData.network.trend = (Math.random() - 0.5) * 2;
  performanceData.responseTime.trend = (Math.random() - 0.5) * 2;

  updatePerformanceData();
} 