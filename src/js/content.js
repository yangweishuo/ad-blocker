import browser from 'webextension-polyfill';

// 初始化
async function init() {
  const { enabled } = await browser.storage.local.get('enabled');
  if (!enabled) return;

  // 移除广告元素
  removeAdElements();
  
  // 监听 DOM 变化
  observeDOMChanges();
}

// 移除广告元素
function removeAdElements() {
  const adSelectors = [
    '[class*="ad-"]',
    '[class*="ads-"]',
    '[class*="banner"]',
    '[class*="sponsor"]',
    '[class*="promotion"]',
    '[class*="advertisement"]',
    '[id*="ad-"]',
    '[id*="ads-"]',
    '[id*="banner"]',
    '[id*="sponsor"]',
    '[id*="promotion"]',
    '[id*="advertisement"]'
  ];

  adSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.remove();
    });
  });
}

// 监听 DOM 变化
function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        removeAdElements();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 监听存储变化
browser.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    if (changes.enabled.newValue) {
      init();
    } else {
      // 重新加载页面以恢复广告
      window.location.reload();
    }
  }
});

// 初始化
init(); 