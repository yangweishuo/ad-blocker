// 初始化存储
chrome.runtime.onInstalled.addListener(async () => {
  // 初始化设置
  await chrome.storage.local.set({
    enabled: true,
    stats: {
      adsBlocked: 0,
      dataSaved: 0,
      timeSaved: 0
    },
    rules: [],
    whitelist: []
  });

  // 初始化规则
  await initializeRules();
});

// 初始化规则
async function initializeRules() {
  try {
    // 获取当前规则
    const { rules } = await chrome.storage.local.get('rules');
    
    // 如果没有规则，添加默认规则
    if (!rules || rules.length === 0) {
      const defaultRules = [
        {
          id: 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "*",
            resourceTypes: ["image", "media", "font", "websocket", "xmlhttprequest", "sub_frame", "script", "other"],
            excludedInitiatorDomains: [],
            excludedRequestMethods: [],
            isUrlFilterCaseSensitive: false
          }
        }
      ];

      // 保存规则到存储
      await chrome.storage.local.set({ rules: defaultRules });

      // 更新 declarativeNetRequest 规则
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: defaultRules
      });
    }
  } catch (error) {
    console.error('Error initializing rules:', error);
  }
}

// 监听规则变化
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local' && changes.rules) {
    const { oldValue, newValue } = changes.rules;
    
    // 更新 declarativeNetRequest 规则
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldValue?.map(rule => rule.id) || [],
      addRules: newValue || []
    });
  }
});

// 监听规则匹配
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  // 更新统计信息
  chrome.storage.local.get('stats', ({ stats }) => {
    const newStats = {
      ...stats,
      adsBlocked: (stats.adsBlocked || 0) + 1,
      dataSaved: (stats.dataSaved || 0) + (info.request.size || 0),
      timeSaved: (stats.timeSaved || 0) + 100 // 假设每个广告节省100ms
    };
    chrome.storage.local.set({ stats: newStats });
  });
}); 