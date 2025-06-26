// Toggle Dark Mode
document.getElementById("toggle-theme").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

// Fetch Timeline
document.getElementById("fetch").addEventListener("click", async () => {
  const auth_token = document.getElementById("auth_token").value;
  const ct0 = document.getElementById("ct0").value;

  const container = document.getElementById("tweets");
  container.innerHTML = '<div class="loader"></div>'; // Show loader

  try {
    const res = await fetch("http://localhost:8000/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_token, ct0 })
    });

    const data = await res.json();
    container.innerHTML = ""; // Clear loader

    data.tweets.forEach(tweet => {
      const el = document.createElement("div");
      el.className = "tweet-card";

      el.innerHTML = `
        <div class="tweet-header">
          <img src="${tweet.profile_image || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}" class="avatar" />
          <div class="user-info">
            <strong>${tweet.name || 'Unknown User'}</strong>
            <span>@${tweet.user}</span>
          </div>
        </div>
        <div class="tweet-content">
          <p>${tweet.text}</p>
          ${
            tweet.images && tweet.images.length > 0
              ? tweet.images.map(img => `<img src="${img}" class="tweet-image" />`).join('')
              : ''
          }
        </div>
        <div class="tweet-time">
          ${new Date(tweet.created_at).toLocaleString()}
        </div>
        <div class="tweet-actions">
          <span><i class="far fa-comment"></i></span> <!-- Comment -->
          <span><i class="fas fa-retweet"></i> <strong>${tweet.retweets}</strong></span> <!-- Retweet -->
          <span><i class="far fa-heart"></i> <strong>${tweet.likes}</strong></span> <!-- Like -->
          <span><i class="far fa-chart-bar"></i></span> <!-- View count -->
          <span><i class="fas fa-share"></i></span> <!-- Share -->
          <span><i class="far fa-bookmark"></i></span> <!-- Bookmark -->
        </div>
      `;

      container.appendChild(el);
    });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    container.innerHTML = "<p>Failed to load tweets. Please check your tokens.</p>";
  }
});
