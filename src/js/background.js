import browser from 'webextension-polyfill';

// 初始化存储
browser.runtime.onInstalled.addListener(async () => {
  const { enabled } = await browser.storage.local.get('enabled');
  if (enabled === undefined) {
    await browser.storage.local.set({ enabled: true });
  }
});

// 监听网络请求
browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    const { enabled } = await browser.storage.local.get('enabled');
    if (!enabled) return { cancel: false };

    // 检查是否是广告请求
    const isAd = await checkIfAd(details.url);
    if (isAd) {
      return { cancel: true };
    }
    return { cancel: false };
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// 检查 URL 是否是广告
async function checkIfAd(url) {
  // 这里可以添加更复杂的广告检测逻辑
  const adPatterns = [
    /ad(s)?/i,
    /banner/i,
    /sponsor/i,
    /promotion/i,
    /advertisement/i
  ];

  return adPatterns.some(pattern => pattern.test(url));
} 