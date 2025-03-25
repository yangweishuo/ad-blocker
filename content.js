// 获取自定义规则
async function getCustomRules() {
  const response = await chrome.runtime.sendMessage({ type: 'GET_RULES' });
  return response.custom || [];
}

// 应用 CSS 选择器规则
async function applyCSSRules() {
  const rules = await getCustomRules();
  const cssRules = rules.filter(rule => rule.type === 'css');
  
  if (cssRules.length === 0) return;
  
  // 创建样式元素
  const style = document.createElement('style');
  style.textContent = cssRules
    .map(rule => `${rule.pattern} { display: none !important; }`)
    .join('\n');
  
  // 添加到页面
  document.head.appendChild(style);
}

// 页面加载完成后应用规则
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyCSSRules);
} else {
  applyCSSRules();
}

// 监听动态内容变化
const observer = new MutationObserver(() => {
  applyCSSRules();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
}); 