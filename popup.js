// 标签页管理
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // 更新标签页状态
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // 更新内容显示
      contents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetTab) {
          content.classList.add('active');
        }
      });
    });
  });
}

// 更新统计信息显示
async function updateStats() {
  const stats = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
  
  document.getElementById('blockedRequests').textContent = stats.blockedRequests;
  document.getElementById('savedBandwidth').textContent = 
    (stats.savedBandwidth / (1024 * 1024)).toFixed(2) + ' MB';
  document.getElementById('lastUpdate').textContent = 
    stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : '-';
  
  // 更新高级统计信息
  document.getElementById('activeRules').textContent = stats.activeRules || 0;
  document.getElementById('whitelistDomains').textContent = stats.whitelistDomains || 0;
}

// 更新性能指标
async function updatePerformanceMetrics() {
  const metrics = await chrome.runtime.sendMessage({ type: 'GET_PERFORMANCE_METRICS' });
  
  document.getElementById('avgBlockTime').textContent = `${metrics.avgBlockTime}ms`;
  document.getElementById('memoryUsage').textContent = `${metrics.memoryUsage}MB`;
  document.getElementById('cpuUsage').textContent = `${metrics.cpuUsage}%`;
  document.getElementById('ruleCacheSize').textContent = `${metrics.ruleCacheSize}KB`;
}

// 更新规则列表显示
async function updateRulesList() {
  const rules = await chrome.runtime.sendMessage({ type: 'GET_RULES' });
  const rulesList = document.getElementById('rulesList');
  
  if (!rules.custom || rules.custom.length === 0) {
    rulesList.innerHTML = `
      <div class="empty-state">
        <p>暂无自定义规则</p>
      </div>
    `;
    return;
  }
  
  rulesList.innerHTML = rules.custom.map(rule => `
    <div class="rule-item">
      <div class="rule-info">
        <div class="rule-type">${rule.type === 'regex' ? '正则表达式' : 'CSS 选择器'}</div>
        <div class="rule-pattern">${rule.pattern}</div>
      </div>
      <button class="btn-danger" data-rule-id="${rule.id}">删除</button>
    </div>
  `).join('');
  
  // 添加删除按钮事件监听
  rulesList.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', () => removeRule(button.dataset.ruleId));
  });
}

// 添加新规则
async function addRule() {
  const type = document.getElementById('ruleType').value;
  const pattern = document.getElementById('rulePattern').value.trim();
  
  if (!pattern) {
    showToast('请输入规则模式');
    return;
  }
  
  try {
    // 验证规则格式
    if (type === 'regex') {
      new RegExp(pattern);
    } else if (type === 'css') {
      document.querySelector(pattern);
    }
    
    const rule = {
      id: Date.now().toString(),
      type,
      pattern
    };
    
    await chrome.runtime.sendMessage({
      type: 'ADD_CUSTOM_RULE',
      rule
    });
    
    document.getElementById('rulePattern').value = '';
    updateRulesList();
    showToast('规则添加成功');
  } catch (error) {
    showToast('无效的规则格式');
  }
}

// 删除规则
async function removeRule(ruleId) {
  await chrome.runtime.sendMessage({
    type: 'REMOVE_CUSTOM_RULE',
    ruleId
  });
  updateRulesList();
  showToast('规则删除成功');
}

// 更新规则源列表
async function updateSourceList() {
  const sources = await chrome.runtime.sendMessage({ type: 'GET_RULE_SOURCES' });
  const sourceList = document.getElementById('sourceList');
  
  sourceList.innerHTML = sources.map(source => `
    <div class="source-item">
      <div class="source-info">
        <div class="source-name">${source.name}</div>
        <div class="source-url">${source.url}</div>
      </div>
      <div class="source-actions">
        <span class="source-status ${source.enabled ? 'active' : 'inactive'}">
          ${source.enabled ? '启用' : '禁用'}
        </span>
        <button class="btn-secondary" data-source-id="${source.id}">
          ${source.enabled ? '禁用' : '启用'}
        </button>
      </div>
    </div>
  `).join('');
  
  // 添加事件监听
  sourceList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => toggleSource(button.dataset.sourceId));
  });
}

// 切换规则源状态
async function toggleSource(sourceId) {
  await chrome.runtime.sendMessage({
    type: 'TOGGLE_RULE_SOURCE',
    sourceId
  });
  updateSourceList();
  showToast('规则源状态已更新');
}

// 更新白名单列表
async function updateWhitelist() {
  const whitelist = await chrome.runtime.sendMessage({ type: 'GET_WHITELIST' });
  const whitelistList = document.getElementById('whitelistList');
  
  if (!whitelist || whitelist.length === 0) {
    whitelistList.innerHTML = `
      <div class="empty-state">
        <p>暂无白名单域名</p>
      </div>
    `;
    return;
  }
  
  whitelistList.innerHTML = whitelist.map(domain => `
    <div class="whitelist-item">
      <span class="whitelist-domain">${domain}</span>
      <button class="btn-danger" data-domain="${domain}">删除</button>
    </div>
  `).join('');
  
  // 添加删除按钮事件监听
  whitelistList.querySelectorAll('.btn-danger').forEach(button => {
    button.addEventListener('click', () => removeFromWhitelist(button.dataset.domain));
  });
}

// 添加域名到白名单
async function addToWhitelist() {
  const domain = document.getElementById('whitelistDomain').value.trim();
  
  if (!domain) {
    showToast('请输入域名');
    return;
  }
  
  try {
    await chrome.runtime.sendMessage({
      type: 'ADD_TO_WHITELIST',
      domain
    });
    
    document.getElementById('whitelistDomain').value = '';
    updateWhitelist();
    showToast('已添加到白名单');
  } catch (error) {
    showToast('添加失败：' + error.message);
  }
}

// 从白名单中删除域名
async function removeFromWhitelist(domain) {
  await chrome.runtime.sendMessage({
    type: 'REMOVE_FROM_WHITELIST',
    domain
  });
  updateWhitelist();
  showToast('已从白名单中删除');
}

// 导出规则
async function exportRules() {
  const rules = await chrome.runtime.sendMessage({ type: 'GET_RULES' });
  const whitelist = await chrome.runtime.sendMessage({ type: 'GET_WHITELIST' });
  
  const exportData = {
    rules,
    whitelist,
    version: '1.0',
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `adblocker-rules-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('规则导出成功');
}

// 导入规则
async function importRules() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.version && data.rules) {
        await chrome.runtime.sendMessage({
          type: 'IMPORT_RULES',
          data
        });
        
        updateRulesList();
        updateWhitelist();
        showToast('规则导入成功');
      } else {
        throw new Error('无效的规则文件格式');
      }
    } catch (error) {
      showToast('导入失败：' + error.message);
    }
  };
  
  input.click();
}

// 更新所有规则源
async function updateAllSources() {
  try {
    await chrome.runtime.sendMessage({ type: 'UPDATE_ALL_SOURCES' });
    updateSourceList();
    showToast('所有规则源已更新');
  } catch (error) {
    showToast('更新失败：' + error.message);
  }
}

// 显示提示消息
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // 添加样式
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 1000;
    animation: fadeInOut 3s ease-in-out;
  `;
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      15% { opacity: 1; transform: translate(-50%, 0); }
      85% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -20px); }
    }
  `;
  document.head.appendChild(style);
  
  // 3秒后移除提示
  setTimeout(() => {
    toast.remove();
    style.remove();
  }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  updateStats();
  updateRulesList();
  updateSourceList();
  updateWhitelist();
  updatePerformanceMetrics();
  
  // 添加规则按钮事件
  document.getElementById('addRule').addEventListener('click', addRule);
  
  // 规则输入框回车事件
  document.getElementById('rulePattern').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addRule();
    }
  });
  
  // 白名单相关事件
  document.getElementById('addWhitelist').addEventListener('click', addToWhitelist);
  document.getElementById('whitelistDomain').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addToWhitelist();
    }
  });
  
  // 导入导出事件
  document.getElementById('exportRules').addEventListener('click', exportRules);
  document.getElementById('importRules').addEventListener('click', importRules);
  
  // 规则源更新事件
  document.getElementById('updateAllSources').addEventListener('click', updateAllSources);
  
  // 自动更新
  setInterval(updateStats, 5000);
  setInterval(updatePerformanceMetrics, 10000);
}); 