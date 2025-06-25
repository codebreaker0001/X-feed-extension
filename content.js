chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "inject_feed") {
    const feed = msg.feedData;
    const container = document.createElement("div");
    container.style.background = "#fff";
    container.style.padding = "20px";
    container.style.margin = "10px";
    container.style.border = "2px solid #1da1f2";
    container.innerHTML = `<h3>Your Fetched Feed</h3>`;

    feed.forEach(tweet => {
      const tweetDiv = document.createElement("div");
      tweetDiv.innerText = tweet;
      tweetDiv.style.borderBottom = "1px solid #ccc";
      tweetDiv.style.marginTop = "10px";
      container.appendChild(tweetDiv);
    });

    document.body.prepend(container);
  }
});
