// 规则管理
let rules = {
  easylist: [],
  custom: [],
  defaultEnabled: true,
  sources: [
    {
      id: 'easylist',
      name: 'EasyList',
      url: 'https://easylist.to/easylist/easylist.txt',
      enabled: true,
      lastUpdate: null
    },
    {
      id: 'fanboy',
      name: 'Fanboy\'s List',
      url: 'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
      enabled: true,
      lastUpdate: null
    },
    {
      id: 'ublock',
      name: 'uBlock Origin',
      url: 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
      enabled: true,
      lastUpdate: null
    }
  ]
};

// 默认规则
const defaultRules = {
  custom: [
    // 常见广告域名
    { id: 'ad_domains', type: 'regex', pattern: '.*\\.(doubleclick|googleadservices|google-analytics|googlesyndication)\\.com.*' },
    { id: 'ad_domains_2', type: 'regex', pattern: '.*\\.(adnxs|advertising|advertising\\.com)\\.com.*' },
    
    // 常见跟踪器
    { id: 'trackers', type: 'regex', pattern: '.*\\.(hotjar|mixpanel|segment|amplitude)\\.com.*' },
    { id: 'trackers_2', type: 'regex', pattern: '.*\\.(intercom|heap|kissmetrics)\\.io.*' },
    
    // 常见恶意内容
    { id: 'malware', type: 'regex', pattern: '.*\\.(cryptominer|miner|botnet)\\.(com|net|org).*' },
    { id: 'malware_2', type: 'regex', pattern: '.*\\.(phishing|scam|spam)\\.(com|net|org).*' },
    
    // 常见弹窗和浮窗
    { id: 'popups', type: 'css', pattern: '.popup, .modal, .overlay, .dialog, .lightbox' },
    { id: 'popups_2', type: 'css', pattern: '[class*="popup"], [class*="modal"], [class*="overlay"]' },
    
    // 常见广告容器
    { id: 'ad_containers', type: 'css', pattern: '.ad-container, .ad-wrapper, .ad-box, .advertisement' },
    { id: 'ad_containers_2', type: 'css', pattern: '[class*="ad-"], [id*="ad-"], [class*="sponsor"]' },
    
    // 常见跟踪脚本
    { id: 'tracking_scripts', type: 'regex', pattern: '.*\\.(js|php)\\?.*(track|analytics|monitor).*' },
    { id: 'tracking_scripts_2', type: 'regex', pattern: '.*\\.(js|php)\\?.*(utm_source|utm_medium|utm_campaign).*' },
    
    // 常见第三方广告服务
    { id: 'third_party_ads', type: 'regex', pattern: '.*\\.(adroll|adform|advertising|adnxs)\\.com.*' },
    { id: 'third_party_ads_2', type: 'regex', pattern: '.*\\.(taboola|outbrain|revcontent)\\.com.*' },
    
    // 常见视频广告
    { id: 'video_ads', type: 'regex', pattern: '.*\\.(doubleclick|googleadservices)\\.com.*/video.*' },
    { id: 'video_ads_2', type: 'css', pattern: '.video-ad, .pre-roll, .mid-roll, .post-roll' },
    
    // 常见社交媒体跟踪
    { id: 'social_tracking', type: 'regex', pattern: '.*\\.(facebook|twitter|linkedin|instagram)\\.com.*/tracking.*' },
    { id: 'social_tracking_2', type: 'regex', pattern: '.*\\.(fb|tw|li|ig)\\.com.*/analytics.*' },

    // 色情网站拦截规则
    { id: 'porn_domains', type: 'regex', pattern: '.*\\.(porn|xxx|sex|adult)\\.(com|net|org|info).*' },
    { id: 'porn_domains_2', type: 'regex', pattern: '.*\\.(cam|webcam|escort|dating)\\.(com|net|org).*' },
    { id: 'porn_keywords', type: 'regex', pattern: '.*(porn|xxx|sex|adult|nude|naked|escort|dating).*' },
    
    // 钓鱼网站拦截规则
    { id: 'phishing_banks', type: 'regex', pattern: '.*\\.(paypal|bank|credit|card|account|login|verify)\\.(com|net|org).*' },
    { id: 'phishing_banks_2', type: 'regex', pattern: '.*(paypal|bank|credit|card|account|login|verify|security).*' },
    { id: 'phishing_social', type: 'regex', pattern: '.*\\.(facebook|twitter|instagram|linkedin|google|apple|microsoft)\\.(com|net|org).*' },
    { id: 'phishing_social_2', type: 'regex', pattern: '.*(facebook|twitter|instagram|linkedin|google|apple|microsoft).*' },
    { id: 'phishing_common', type: 'regex', pattern: '.*(verify|confirm|update|secure|account|login|password).*' },
    
    // 可疑域名模式
    { id: 'suspicious_domains', type: 'regex', pattern: '.*\\.(xyz|top|cc|tk|ml|ga|cf|gq|pw)\\.*' },
    { id: 'suspicious_domains_2', type: 'regex', pattern: '.*(free|win|prize|gift|offer|discount|sale).*' },
    
    // 可疑URL模式
    { id: 'suspicious_urls', type: 'regex', pattern: '.*(login|signin|verify|confirm|update|secure).*' },
    { id: 'suspicious_urls_2', type: 'regex', pattern: '.*(account|password|bank|credit|card).*' }
  ]
};

// 白名单
let whitelist = [];

// 统计信息
let stats = {
  blockedRequests: 0,
  savedBandwidth: 0,
  lastUpdate: null,
  activeRules: 0,
  whitelistDomains: 0,
  performance: {
    avgBlockTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    ruleCacheSize: 0
  }
};

// 性能监控
let performanceMetrics = {
  blockTimes: [],
  lastMemoryCheck: Date.now(),
  lastCpuCheck: Date.now()
};

// 初始化
async function initialize() {
  // 从存储中加载数据
  const stored = await chrome.storage.local.get(['rules', 'whitelist', 'stats', 'isInitialized', 'defaultEnabled']);
  
  // 如果是首次安装，添加默认规则
  if (!stored.isInitialized) {
    rules.custom = defaultRules.custom;
    rules.defaultEnabled = true;
    await chrome.storage.local.set({ isInitialized: true });
  }
  
  if (stored.rules) {
    rules = stored.rules;
  }
  if (stored.whitelist) {
    whitelist = stored.whitelist;
  }
  if (stored.stats) {
    stats = stored.stats;
  }
  if (stored.defaultEnabled !== undefined) {
    rules.defaultEnabled = stored.defaultEnabled;
  }
  
  // 设置每日更新
  scheduleDailyUpdate();
  
  // 开始性能监控
  startPerformanceMonitoring();
  
  // 保存初始规则
  await saveRules();
}

// 每日更新规则
async function updateEasyList() {
  try {
    for (const source of rules.sources) {
      if (!source.enabled) continue;
      
      const response = await fetch(source.url);
      const text = await response.text();
      
      if (source.id === 'easylist') {
        rules.easylist = parseEasyList(text);
      } else {
        // 合并其他规则源
        rules.easylist = [...new Set([...rules.easylist, ...parseEasyList(text)])];
      }
      
      source.lastUpdate = new Date().toISOString();
    }
    
    await saveRules();
    stats.lastUpdate = new Date().toISOString();
    await saveStats();
    
    // 更新活跃规则数
    stats.activeRules = rules.easylist.length + rules.custom.length;
    await saveStats();
  } catch (error) {
    console.error('Failed to update rules:', error);
  }
}

// 解析规则文本
function parseEasyList(text) {
  return text
    .split('\n')
    .filter(line => line && !line.startsWith('!') && !line.startsWith('['))
    .map(line => line.trim());
}

// 保存规则到存储
async function saveRules() {
  await chrome.storage.local.set({
    rules: rules,
    defaultEnabled: rules.defaultEnabled
  });
}

// 保存白名单到存储
async function saveWhitelist() {
  await chrome.storage.local.set({ whitelist });
  stats.whitelistDomains = whitelist.length;
  await saveStats();
}

// 保存统计信息到存储
async function saveStats() {
  await chrome.storage.local.set({ stats });
}

// 设置每日更新
function scheduleDailyUpdate() {
  const now = new Date();
  const lastUpdate = stats.lastUpdate ? new Date(stats.lastUpdate) : null;
  
  if (!lastUpdate || (now - lastUpdate) > 24 * 60 * 60 * 1000) {
    updateEasyList();
  }
  
  // 设置下次更新
  const nextUpdate = new Date(now);
  nextUpdate.setDate(nextUpdate.getDate() + 1);
  nextUpdate.setHours(0, 0, 0, 0);
  
  const delay = nextUpdate - now;
  setTimeout(() => {
    updateEasyList();
    scheduleDailyUpdate();
  }, delay);
}

// 检查 URL 是否在白名单中
function isWhitelisted(url) {
  const domain = new URL(url).hostname;
  return whitelist.some(w => domain.includes(w));
}

// 检查 URL 是否匹配规则
function shouldBlock(url) {
  if (isWhitelisted(url)) {
    return false;
  }
  
  const startTime = performance.now();
  
  // 检查 EasyList 规则
  for (const rule of rules.easylist) {
    if (url.includes(rule)) {
      recordBlockTime(startTime);
      return true;
    }
  }
  
  // 检查自定义规则
  for (const rule of rules.custom) {
    try {
      if (rule.type === 'regex') {
        const regex = new RegExp(rule.pattern);
        if (regex.test(url)) {
          recordBlockTime(startTime);
          return true;
        }
      } else if (rule.type === 'css') {
        // CSS 选择器规则在页面加载时处理
        continue;
      }
    } catch (error) {
      console.error('Invalid rule:', rule);
    }
  }
  
  recordBlockTime(startTime);
  return false;
}

// 记录拦截时间
function recordBlockTime(startTime) {
  const blockTime = performance.now() - startTime;
  performanceMetrics.blockTimes.push(blockTime);
  
  // 保持最近1000个记录
  if (performanceMetrics.blockTimes.length > 1000) {
    performanceMetrics.blockTimes.shift();
  }
  
  // 更新平均拦截时间
  stats.performance.avgBlockTime = Math.round(
    performanceMetrics.blockTimes.reduce((a, b) => a + b, 0) / performanceMetrics.blockTimes.length
  );
}

// 性能监控
function startPerformanceMonitoring() {
  setInterval(updatePerformanceMetrics, 10000);
}

// 更新性能指标
async function updatePerformanceMetrics() {
  // 更新内存使用
  const memory = await chrome.system.memory.getInfo();
  stats.performance.memoryUsage = Math.round(memory.availableCapacity / (1024 * 1024));
  
  // 更新 CPU 使用率
  const cpu = await chrome.system.cpu.getInfo();
  const now = Date.now();
  const timeDiff = now - performanceMetrics.lastCpuCheck;
  
  if (timeDiff > 0) {
    const cpuUsage = cpu.processors.reduce((acc, proc) => acc + proc.usage.user + proc.usage.kernel, 0);
    stats.performance.cpuUsage = Math.round(cpuUsage / timeDiff);
  }
  
  performanceMetrics.lastCpuCheck = now;
  
  // 更新规则缓存大小
  const rulesString = JSON.stringify(rules);
  stats.performance.ruleCacheSize = Math.round(rulesString.length / 1024);
  
  await saveStats();
}

// 监听网络请求
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (shouldBlock(details.url)) {
      stats.blockedRequests++;
      stats.savedBandwidth += details.requestBody?.raw?.[0]?.bytes || 0;
      saveStats();
      return { cancel: true };
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 处理 CSS 选择器规则
chrome.scripting.registerContentScripts([{
  id: 'ad-blocker-css',
  matches: ['<all_urls>'],
  css: ['content.css'],
  js: ['content.js']
}]);

// 初始化扩展
initialize();

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STATS':
      sendResponse(stats);
      break;
    case 'GET_RULES':
      sendResponse(rules);
      break;
    case 'GET_WHITELIST':
      sendResponse(whitelist);
      break;
    case 'GET_RULE_SOURCES':
      sendResponse(rules.sources);
      break;
    case 'GET_PERFORMANCE_METRICS':
      sendResponse(stats.performance);
      break;
    case 'ADD_CUSTOM_RULE':
      rules.custom.push(message.rule);
      saveRules();
      stats.activeRules = rules.easylist.length + rules.custom.length;
      saveStats();
      sendResponse({ success: true });
      break;
    case 'REMOVE_CUSTOM_RULE':
      rules.custom = rules.custom.filter(r => r.id !== message.ruleId);
      saveRules();
      stats.activeRules = rules.easylist.length + rules.custom.length;
      saveStats();
      sendResponse({ success: true });
      break;
    case 'ADD_TO_WHITELIST':
      if (!whitelist.includes(message.domain)) {
        whitelist.push(message.domain);
        saveWhitelist();
      }
      sendResponse({ success: true });
      break;
    case 'REMOVE_FROM_WHITELIST':
      whitelist = whitelist.filter(d => d !== message.domain);
      saveWhitelist();
      sendResponse({ success: true });
      break;
    case 'TOGGLE_RULE_SOURCE':
      const source = rules.sources.find(s => s.id === message.sourceId);
      if (source) {
        source.enabled = !source.enabled;
        saveRules();
      }
      sendResponse({ success: true });
      break;
    case 'UPDATE_ALL_SOURCES':
      updateEasyList();
      sendResponse({ success: true });
      break;
    case 'IMPORT_RULES':
      if (message.data.rules) {
        rules = message.data.rules;
        saveRules();
      }
      if (message.data.whitelist) {
        whitelist = message.data.whitelist;
        saveWhitelist();
      }
      sendResponse({ success: true });
      break;
    case 'TOGGLE_DEFAULT_RULES':
      toggleDefaultRules(message.enabled);
      sendResponse({ success: true });
      break;
  }
  return true;
});

// 更新规则
async function updateRules(newRules) {
  rules = newRules;
  await saveRules();
}

// 启用/禁用默认规则
async function toggleDefaultRules(enabled) {
  rules.defaultEnabled = enabled;
  if (enabled) {
    // 如果启用默认规则，确保它们存在
    if (!rules.custom.some(rule => rule.id.startsWith('default_'))) {
      rules.custom = [...defaultRules.custom, ...rules.custom];
    }
  } else {
    // 如果禁用默认规则，移除它们
    rules.custom = rules.custom.filter(rule => !rule.id.startsWith('default_'));
  }
  await saveRules();
}

// 检查是否应该拦截 URL
function shouldBlockUrl(url) {
  // 检查白名单
  if (isWhitelisted(url)) {
    return false;
  }

  // 检查自定义规则
  for (const rule of rules.custom) {
    if (rule.enabled) {
      if (rule.type === 'regex' && new RegExp(rule.pattern).test(url)) {
        return true;
      }
    }
  }

  // 检查 EasyList 规则
  for (const rule of rules.easylist) {
    if (rule.enabled) {
      if (rule.type === 'regex' && new RegExp(rule.pattern).test(url)) {
        return true;
      }
    }
  }

  return false;
} 