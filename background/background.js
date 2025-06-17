class XFeedBackground {
  constructor() {
    this.init();
  }

  init() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.onInstall();
      }
    });

    // Handle web requests if needed
    this.setupWebRequestHandling();
  }

  onInstall() {
    // Initialize storage
    chrome.storage.local.set({
      accounts: [],
      currentAccount: null
    });
  }

  setupWebRequestHandling() {
    // Monitor network requests to X/Twitter if needed
    chrome.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        // Log or modify requests if necessary
        return { requestHeaders: details.requestHeaders };
      },
      { urls: ["https://x.com/*", "https://twitter.com/*"] },
      ["requestHeaders"]
    );
  }
}

new XFeedBackground();