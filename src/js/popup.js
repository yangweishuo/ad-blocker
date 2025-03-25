import browser from 'webextension-polyfill';

document.addEventListener('DOMContentLoaded', async () => {
  // 初始化 UI 元素
  const enableButton = document.getElementById('enableButton');
  const disableButton = document.getElementById('disableButton');
  const statsContainer = document.getElementById('statsContainer');
  const rulesContainer = document.getElementById('rulesContainer');

  // 获取当前状态
  const { enabled } = await browser.storage.local.get('enabled');
  updateUI(enabled);

  // 添加事件监听器
  enableButton.addEventListener('click', async () => {
    await browser.storage.local.set({ enabled: true });
    updateUI(true);
  });

  disableButton.addEventListener('click', async () => {
    await browser.storage.local.set({ enabled: false });
    updateUI(false);
  });

  // 更新 UI 状态
  function updateUI(enabled) {
    enableButton.style.display = enabled ? 'none' : 'block';
    disableButton.style.display = enabled ? 'block' : 'none';
    statsContainer.style.display = enabled ? 'block' : 'none';
    rulesContainer.style.display = enabled ? 'block' : 'none';
  }
}); 