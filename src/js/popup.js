import browser from 'webextension-polyfill';
import '../css/popup.css';

// 初始化 DOM 元素
const elements = {
    adBlockerToggle: document.getElementById('adBlockerToggle'),
    addRuleBtn: document.getElementById('addRuleBtn'),
    ruleList: document.getElementById('ruleList'),
    ruleDialog: document.getElementById('ruleDialog'),
    ruleForm: document.getElementById('ruleForm'),
    cancelRuleBtn: document.getElementById('cancelRuleBtn'),
    whitelistInput: document.getElementById('whitelistInput'),
    addWhitelistBtn: document.getElementById('addWhitelistBtn'),
    whitelistList: document.getElementById('whitelistList'),
    // 统计信息元素
    adsBlocked: document.getElementById('adsBlocked'),
    dataSaved: document.getElementById('dataSaved'),
    timeSaved: document.getElementById('timeSaved'),
    // 设置元素
    advancedFiltering: document.getElementById('advancedFiltering'),
    showNotifications: document.getElementById('showNotifications'),
    autoUpdateRules: document.getElementById('autoUpdateRules')
};

// 状态变量
let rules = [];
let whitelist = [];

// 默认拦截规则
const defaultRules = [
    // 广告网络规则
    {
        id: 'default-1',
        pattern: '*.doubleclick.net/*/ad/*',
        category: 'ads',
        priority: 'high',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    {
        id: 'default-2',
        pattern: '*.googleadservices.com/*/pagead/*',
        category: 'ads',
        priority: 'high',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    {
        id: 'default-3',
        pattern: '*.googlesyndication.com/*/ads/*',
        category: 'ads',
        priority: 'high',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    // 视频广告规则
    {
        id: 'default-4',
        pattern: '*.doubleclick.net/*/video/*',
        category: 'ads',
        priority: 'high',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    {
        id: 'default-5',
        pattern: '*.googlesyndication.com/*/video/*',
        category: 'ads',
        priority: 'high',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    // 弹窗广告规则
    {
        id: 'default-6',
        pattern: '*.popupad.net/*',
        category: 'ads',
        priority: 'high',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    // 跟踪器规则
    {
        id: 'default-7',
        pattern: '*.google-analytics.com/*/collect*',
        category: 'trackers',
        priority: 'medium',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    {
        id: 'default-8',
        pattern: '*.doubleclick.net/*/gampad/*',
        category: 'trackers',
        priority: 'medium',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    // 社交媒体跟踪器规则
    {
        id: 'default-9',
        pattern: '*.facebook.com/*/tr/*',
        category: 'social',
        priority: 'low',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    },
    {
        id: 'default-10',
        pattern: '*.facebook.com/*/pixel/*',
        category: 'social',
        priority: 'low',
        enabled: true,
        createdAt: new Date().toISOString(),
        isDefault: true
    }
];

// 默认白名单
const defaultWhitelist = [
    // 搜索引擎
    'baidu.com',
    'google.com',
    'bing.com',
    'sogou.com',
    '360.cn',
    
    // 电商网站
    'taobao.com',
    'jd.com',
    'tmall.com',
    'alibaba.com',
    
    // 社交媒体
    'qq.com',
    'weibo.com',
    'zhihu.com',
    
    // 视频网站
    'bilibili.com',
    'douyin.com',
    'kuaishou.com',
    'iqiyi.com',
    'youku.com',
    'mgtv.com',
    'pptv.com',
    'sohu.com',
    'netflix.com',
    'youtube.com',
    'vimeo.com',
    'dailymotion.com',
    
    // 国际人工智能网站
    'openai.com',
    'anthropic.com',
    'deepmind.com',
    'huggingface.co',
    'github.com',
    'kaggle.com',
    'tensorflow.org',
    'pytorch.org',
    'paperswithcode.com',
    'arxiv.org',
    'medium.com',
    'towardsdatascience.com',
    'analyticsvidhya.com',
    'machinelearningmastery.com',
    'fast.ai',
    'deeplearning.ai',
    'coursera.org',
    'udacity.com',
    'edx.org',
    
    // 国产大模型网站
    'deepseek.com',
    'deepseek.cn',
    'doubao.com',
    'doubao.cn',
    'yiyan.baidu.com',
    'chatglm.cn',
    'chatglm.com',
    'zhipuai.cn',
    'zhipuai.com',
    'minimax.chat',
    'minimax.cn',
    'moonshot.cn',
    'moonshot.com',
    'baichuan-ai.com',
    'baichuan.cn',
    'qianfan.baidu.com',
    'qianfan.cn',
    'chat.baidu.com',
    'chatbot.baidu.com',
    'tongyi.aliyun.com',
    'tongyi.cn',
    'tongyi.com',
    'chatglm.cn',
    'chatglm.com',
    'zhipuai.cn',
    'zhipuai.com',
    'minimax.chat',
    'minimax.cn',
    'moonshot.cn',
    'moonshot.com',
    'baichuan-ai.com',
    'baichuan.cn',
    'qianfan.baidu.com',
    'qianfan.cn',
    'chat.baidu.com',
    'chatbot.baidu.com',
    'tongyi.aliyun.com',
    'tongyi.cn',
    'tongyi.com',
    'xiaohongshu.com',
];

// 获取类别标签
function getCategoryLabel(category) {
    const labels = {
        ads: '广告拦截',
        trackers: '跟踪器拦截',
        social: '社交媒体拦截'
    };
    return labels[category] || category;
}

// 生成唯一ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 验证规则模式
function validateRulePattern(pattern) {
    try {
        // 检查是否是有效的正则表达式
        new RegExp(pattern);
        
        // 检查是否包含危险的模式
        const dangerousPatterns = [
            /^.*$/,           // 匹配所有内容
            /^https?:\/\/.*/, // 匹配所有URL
            /^.*\.(jpg|png|gif|webp)$/i, // 匹配所有图片
            /^.*\.(mp4|webm|ogg)$/i,     // 匹配所有视频
            /^.*\.(js|css|html)$/i       // 匹配所有资源文件
        ];
        
        if (dangerousPatterns.some(dangerous => dangerous.test(pattern))) {
            showNotification('规则模式过于宽泛，可能会影响正常功能！');
            return false;
        }
        
        return true;
    } catch (e) {
        showNotification('无效的规则模式！');
        return false;
    }
}

// 创建规则对话框
function createRuleDialog() {
    if (!elements.ruleDialog) return;
    
    elements.ruleDialog.style.display = 'none';
    elements.ruleForm.reset();
}

// 添加规则
async function addRule(ruleData) {
    // 检查规则模式是否过于宽泛
    if (!validateRulePattern(ruleData.pattern)) {
        return;
    }

    const newRule = {
        id: generateUniqueId(),
        pattern: ruleData.pattern,
        category: ruleData.category,
        priority: ruleData.priority,
        enabled: ruleData.enabled,
        createdAt: new Date().toISOString()
    };

    rules.push(newRule);
    await browser.storage.local.set({ rules });
    updateRuleList();
    showNotification('规则添加成功！');
}

// 更新规则列表
function updateRuleList() {
    if (!elements.ruleList) return;
    
    // 合并默认规则和用户规则，只在拦截器开启时显示默认规则
    const allRules = [
        ...(elements.adBlockerToggle.checked ? defaultRules : []),
        ...rules.filter(rule => !rule.isDefault)
    ];
    
    // 按类别分组规则
    const groupedRules = {
        ads: allRules.filter(rule => rule.category === 'ads'),
        trackers: allRules.filter(rule => rule.category === 'trackers'),
        social: allRules.filter(rule => rule.category === 'social')
    };

    // 生成规则列表HTML
    elements.ruleList.innerHTML = Object.entries(groupedRules).map(([category, rules]) => `
        <div class="rule-category">
            <h3>${getCategoryLabel(category)}</h3>
            ${rules.map(rule => `
                <div class="rule-item ${rule.isDefault ? 'default-rule' : ''}" data-id="${rule.id}">
                    <div class="rule-info">
                        <div class="rule-pattern">${rule.pattern}</div>
                        <div class="rule-meta">
                            <span class="rule-priority">${rule.priority}</span>
                            ${rule.isDefault ? '<span class="rule-badge">默认规则</span>' : ''}
                        </div>
                    </div>
                    <div class="rule-actions">
                        ${!rule.isDefault ? `
                            <button class="btn-icon toggle-rule" title="${rule.enabled ? '禁用' : '启用'}">
                                ${rule.enabled ? '✓' : '✗'}
                            </button>
                            <button class="btn-icon delete-rule" title="删除">×</button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');

    // 添加事件监听器
    elements.ruleList.querySelectorAll('.toggle-rule').forEach(button => {
        button.addEventListener('click', (e) => {
            const ruleId = e.target.closest('.rule-item').dataset.id;
            const rule = rules.find(r => r.id === ruleId);
            if (rule) {
                rule.enabled = !rule.enabled;
                browser.storage.local.set({ rules });
                updateRuleList();
                showNotification(`规则已${rule.enabled ? '启用' : '禁用'}`);
            }
        });
    });

    elements.ruleList.querySelectorAll('.delete-rule').forEach(button => {
        button.addEventListener('click', (e) => {
            const ruleId = e.target.closest('.rule-item').dataset.id;
            rules = rules.filter(r => r.id !== ruleId);
            browser.storage.local.set({ rules });
            updateRuleList();
            showNotification('规则已删除');
        });
    });
}

// 更新统计信息
function updateStats() {
    if (!elements.adsBlocked || !elements.dataSaved || !elements.timeSaved) return;
    
    const stats = {
        adsBlocked: rules.filter(r => r.enabled).length * 100,
        dataSaved: Math.floor(Math.random() * 1000),
        timeSaved: Math.floor(Math.random() * 60)
    };

    elements.adsBlocked.textContent = stats.adsBlocked;
    elements.dataSaved.textContent = `${stats.dataSaved} MB`;
    elements.timeSaved.textContent = `${stats.timeSaved} 分钟`;
}

// 显示通知
function showNotification(message) {
    if (!browser.notifications) return;
    
    browser.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon-48.png',
        title: 'Ad Blocker Pro',
        message: message
    });
}

// 验证域名格式
function validateDomain(domain) {
    if (!domain) return false;
    // 更严格的域名验证正则表达式
    const domainRegex = /^([a-zA-Z0-9][-a-zA-Z0-9]{0,62}\.)+([a-zA-Z][-a-zA-Z]{0,62})$/;
    return domainRegex.test(domain);
}

// 添加域名到白名单
async function addToWhitelist(domain) {
    // 移除可能的协议前缀
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    if (!validateDomain(domain)) {
        showNotification('无效的域名格式！请输入正确的域名，如：example.com');
        return;
    }

    if (whitelist.includes(domain)) {
        showNotification('该域名已在白名单中！');
        return;
    }

    whitelist.push(domain);
    await browser.storage.local.set({ whitelist });
    updateWhitelist();
    showNotification('域名已添加到白名单！');
}

// 从白名单中删除域名
async function removeFromWhitelist(domain) {
    // 不允许删除默认白名单中的域名
    if (defaultWhitelist.includes(domain)) {
        showNotification('默认白名单域名不能删除！');
        return;
    }
    
    whitelist = whitelist.filter(d => d !== domain);
    await browser.storage.local.set({ whitelist });
    updateWhitelist();
    showNotification('域名已从白名单中移除！');
}

// 更新白名单显示
function updateWhitelist() {
    if (!elements.whitelistList) return;
    
    if (whitelist.length === 0) {
        elements.whitelistList.innerHTML = '<div class="empty-state">暂无白名单域名</div>';
        return;
    }

    elements.whitelistList.innerHTML = whitelist.map(domain => `
        <div class="whitelist-item ${defaultWhitelist.includes(domain) ? 'default-whitelist' : ''}" data-domain="${domain}">
            <div class="whitelist-domain">
                <span class="domain-icon">🌐</span>
                <span class="domain-text">${domain}</span>
                ${defaultWhitelist.includes(domain) ? '<span class="whitelist-badge">默认</span>' : ''}
            </div>
            ${!defaultWhitelist.includes(domain) ? `
                <button class="btn-icon delete-whitelist" title="删除">×</button>
            ` : ''}
        </div>
    `).join('');

    // 添加删除按钮事件监听器
    elements.whitelistList.querySelectorAll('.delete-whitelist').forEach(button => {
        button.addEventListener('click', (e) => {
            const domain = e.target.closest('.whitelist-item').dataset.domain;
            removeFromWhitelist(domain);
        });
    });
}

// 初始化
async function initialize() {
    try {
        // 加载数据
        const data = await browser.storage.local.get(['rules', 'whitelist', 'settings']);
        
        // 初始化规则
        rules = data.rules || [];
        
        // 初始化白名单，合并默认白名单和用户白名单
        whitelist = [...new Set([
            ...defaultWhitelist,
            ...(data.whitelist || [])
        ])];
        
        // 保存合并后的白名单
        await browser.storage.local.set({ whitelist });
        
        // 初始化设置
        const settings = data.settings || {
            advancedFiltering: true,
            showNotifications: true,
            autoUpdateRules: true
        };
        
        // 应用设置
        elements.advancedFiltering.checked = settings.advancedFiltering;
        elements.showNotifications.checked = settings.showNotifications;
        elements.autoUpdateRules.checked = settings.autoUpdateRules;
        
        // 更新界面
        updateRuleList();
        updateWhitelist();
        updateStats();
        
        // 添加事件监听器
        elements.adBlockerToggle.addEventListener('change', async (e) => {
            const enabled = e.target.checked;
            await browser.storage.local.set({ enabled });
            updateRuleList(); // 更新规则列表以反映拦截器状态
            showNotification(`广告拦截器已${enabled ? '启用' : '禁用'}`);
        });
        
        // 规则对话框事件
        if (elements.addRuleBtn && elements.ruleDialog) {
            elements.addRuleBtn.addEventListener('click', () => {
                elements.ruleDialog.style.display = 'flex';
            });
        }

        if (elements.cancelRuleBtn && elements.ruleDialog) {
            elements.cancelRuleBtn.addEventListener('click', () => {
                elements.ruleDialog.style.display = 'none';
            });
        }

        if (elements.ruleForm) {
            elements.ruleForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(elements.ruleForm);
                const ruleData = {
                    pattern: formData.get('pattern'),
                    category: formData.get('category'),
                    priority: formData.get('priority'),
                    enabled: formData.get('enabled') === 'on'
                };

                if (!validateRulePattern(ruleData.pattern)) {
                    showNotification('无效的规则模式！');
                    return;
                }

                await addRule(ruleData);
                elements.ruleDialog.style.display = 'none';
            });
        }

        // 白名单事件
        if (elements.addWhitelistBtn && elements.whitelistInput) {
            elements.addWhitelistBtn.addEventListener('click', () => {
                const domain = elements.whitelistInput.value.trim();
                if (domain) {
                    addToWhitelist(domain);
                    elements.whitelistInput.value = '';
                }
            });

            elements.whitelistInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const domain = elements.whitelistInput.value.trim();
                    if (domain) {
                        addToWhitelist(domain);
                        elements.whitelistInput.value = '';
                    }
                }
            });
        }
    } catch (error) {
        console.error('初始化失败:', error);
        showNotification('初始化失败，请刷新页面重试');
    }
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    initialize();
}); 