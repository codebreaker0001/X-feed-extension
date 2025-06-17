class XFeedManager {
  constructor() {
    this.currentAccount = null;
    this.accounts = [];
    this.init();
  }

  async init() {
    await this.loadAccounts();
    this.setupEventListeners();
    this.renderAccounts();
  }

  async loadAccounts() {
    const result = await chrome.storage.local.get(['accounts', 'currentAccount']);
    this.accounts = result.accounts || [];
    this.currentAccount = result.currentAccount || null;
  }

  async saveAccounts() {
    await chrome.storage.local.set({
      accounts: this.accounts,
      currentAccount: this.currentAccount
    });
  }

  setupEventListeners() {
    document.getElementById('add-account').addEventListener('click', () => {
      this.addAccount();
    });
  }

  async addAccount() {
    const username = document.getElementById('username').value.trim();
    const authToken = document.getElementById('auth-token').value.trim();
    
    if (!username || !authToken) {
      alert('Please fill in both username and auth token');
      return;
    }

    const account = {
      id: Date.now().toString(),
      username: username,
      authToken: authToken,
      addedAt: new Date().toISOString()
    };

    this.accounts.push(account);
    await this.saveAccounts();
    this.renderAccounts();
    
    // Clear inputs
    document.getElementById('username').value = '';
    document.getElementById('auth-token').value = '';
  }

  async switchAccount(accountId) {
    this.currentAccount = accountId;
    await this.saveAccounts();
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      action: 'switchAccount',
      accountId: accountId
    });
    
    this.renderAccounts();
  }

  renderAccounts() {
    const accountList = document.getElementById('account-list');
    const currentAccountEl = document.getElementById('current-account');
    
    // Update current account display
    const currentAcc = this.accounts.find(acc => acc.id === this.currentAccount);
    currentAccountEl.textContent = currentAcc ? `@${currentAcc.username}` : 'Your Feed';
    
    // Render account list
    accountList.innerHTML = '';
    
    // Add "Your Feed" option
    const yourFeedItem = document.createElement('div');
    yourFeedItem.className = `account-item ${!this.currentAccount ? 'active' : ''}`;
    yourFeedItem.innerHTML = `
      <span>Your Feed</span>
      <button onclick="feedManager.switchAccount(null)">Switch</button>
    `;
    accountList.appendChild(yourFeedItem);
    
    // Add shared accounts
    this.accounts.forEach(account => {
      const accountItem = document.createElement('div');
      accountItem.className = `account-item ${account.id === this.currentAccount ? 'active' : ''}`;
      accountItem.innerHTML = `
        <span>@${account.username}</span>
        <div>
          <button onclick="feedManager.switchAccount('${account.id}')">Switch</button>
          <button onclick="feedManager.removeAccount('${account.id}')" style="background-color: #dc3545;">Remove</button>
        </div>
      `;
      accountList.appendChild(accountItem);
    });
  }

  async removeAccount(accountId) {
    this.accounts = this.accounts.filter(acc => acc.id !== accountId);
    if (this.currentAccount === accountId) {
      this.currentAccount = null;
    }
    await this.saveAccounts();
    this.renderAccounts();
  }
}

// Initialize the manager
const feedManager = new XFeedManager();
