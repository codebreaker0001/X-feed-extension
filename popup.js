document.getElementById("toggle-theme").addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

document.getElementById("fetch").addEventListener("click", async () => {
  const auth_token = document.getElementById("auth_token").value;
  const ct0 = document.getElementById("ct0").value;

  // Show loaders
  document.getElementById("feed").innerHTML = '<div class="loader"></div>';
  document.getElementById("followers").innerHTML = '<h3>Followers</h3><div class="loader"></div>';
  document.getElementById("following").innerHTML = '<h3>Following</h3><div class="loader"></div>';
  document.getElementById("friends").innerHTML = '<h3>Friends</h3><div class="loader"></div>';

  fetchSection("timeline", { auth_token, ct0 }, "feed", renderTweets);
  fetchSection("getUserFollowers", { auth_token, ct0 }, "followers", renderUsers);
  fetchSection("getUserFollowing", { auth_token, ct0 }, "following", renderUsers);
  fetchSection("getUserFriends", { auth_token, ct0 }, "friends", renderUsers);
});

async function fetchSection(endpoint, bodyData, containerId, renderFunction) {
  try {
    // ✅ Correct API URL
    const res = await fetch(`https://x-feed-extension.up.railway.app/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();
    if (endpoint === "timeline") {
      renderFunction(data.tweets, containerId);
    } else if (endpoint === "getUserFollowers") {
      renderFunction(data.followers, containerId);
    } else if (endpoint === "getUserFollowing") {
      renderFunction(data.following, containerId);
    } else if (endpoint === "getUserFriends") {
      renderFunction(data.friends, containerId);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    const container = document.getElementById(containerId);
    container.innerHTML = `<p>Failed to load ${endpoint.replace('getUser', '').replace('timeline', 'timeline')}. Please check your tokens.</p>`;
  }
}

function renderTweets(tweets, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  tweets.forEach(tweet => {
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
        ${tweet.images && tweet.images.length > 0 ? tweet.images.map(img => `<img src="${img}" class="tweet-image" />`).join('') : ''}
      </div>
      <div class="tweet-time">
        ${new Date(tweet.created_at).toLocaleString()}
      </div>
      <div class="tweet-actions">
        <span><i class="far fa-comment"></i></span>
        <span><i class="fas fa-retweet"></i> <strong>${tweet.retweets}</strong></span>
        <span><i class="far fa-heart"></i> <strong>${tweet.likes}</strong></span>
        <span><i class="far fa-chart-bar"></i></span>
        <span><i class="fas fa-share"></i></span>
        <span><i class="far fa-bookmark"></i></span>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderUsers(users, containerId) {
  const container = document.getElementById(containerId);
  const sectionTitle = container.querySelector('h3').outerHTML;
  container.innerHTML = sectionTitle;

  users.forEach(user => {
    const el = document.createElement("div");
    el.className = "tweet-card";
    el.innerHTML = `
      <div class="tweet-header">
        <img src="${user.profile_image || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'}" class="avatar" />
        <div class="user-info">
          <strong>${user.name || 'Unknown User'}</strong>
          <span>@${user.screen_name}</span>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}
