class XFeedInjector {
  constructor() {
    this.currentAuthToken = null;
    this.originalFetch = window.fetch;
    this.init();
  }

  init() {
    this.interceptNetworkRequests();
    this.setupMessageListener();
    this.addUIIndicator();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'switchAccount') {
        this.switchToAccount(message.accountId);
      }
    });
  }

  async switchToAccount(accountId) {
    const result = await chrome.storage.local.get(['accounts']);
    const accounts = result.accounts || [];
    
    if (accountId) {
      const account = accounts.find(acc => acc.id === accountId);
      if (account) {
        this.currentAuthToken = account.authToken;
        this.updateUIIndicator(`Viewing @${account.username}'s feed`);
        this.refreshFeed();
      }
    } else {
      this.currentAuthToken = null;
      this.updateUIIndicator('Viewing your feed');
      this.refreshFeed();
    }
  }

  interceptNetworkRequests() {
    const self = this;
    
    window.fetch = async function(url, options = {}) {
      // Check if this is a Twitter API request
      if (url.includes('/api/') && self.currentAuthToken) {
        // Modify headers to use the shared auth token
        const modifiedOptions = {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${self.currentAuthToken}`
          }
        };
        return self.originalFetch.call(this, url, modifiedOptions);
      }
      
      return self.originalFetch.call(this, url, options);
    };
  }

  addUIIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'x-feed-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #1da1f2;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    indicator.textContent = 'Viewing your feed';
    document.body.appendChild(indicator);
  }

  updateUIIndicator(text) {
    const indicator = document.getElementById('x-feed-indicator');
    if (indicator) {
      indicator.textContent = text;
      indicator.style.backgroundColor = this.currentAuthToken ? '#ff6b35' : '#1da1f2';
    }
  }

  refreshFeed() {
    // Force refresh the timeline
    window.location.reload();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new XFeedInjector();
  });
} else {
  new XFeedInjector();
}
