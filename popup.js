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
    // ✅ Enhanced fetch with better CORS handling
    const res = await fetch(`https://x-feed-extension.up.railway.app/${endpoint}`, {
      method: "POST",
      mode: "cors", // Explicitly set CORS mode
      credentials: "omit", // Don't send credentials to avoid preflight issues
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyData)
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

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
    
    // ✅ Better error handling with retry suggestion
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      container.innerHTML = `
        <p style="color: red;">
          CORS Error: Unable to connect to server.<br>
          <small>Try refreshing the page or check if the server is running.</small>
        </p>
      `;
    } else {
      container.innerHTML = `<p>Failed to load ${endpoint.replace('getUser', '').replace('timeline', 'timeline')}. Please check your tokens.</p>`;
    }
  }
}

// ✅ Alternative fetch function using no-cors mode (if above doesn't work)
async function fetchSectionNoCors(endpoint, bodyData, containerId, renderFunction) {
  try {
    const res = await fetch(`https://x-feed-extension.up.railway.app/${endpoint}`, {
      method: "POST",
      mode: "no-cors", // This bypasses CORS but returns opaque response
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    });
    
    // Note: With no-cors, we can't read the response
    // This is mainly for testing if the request goes through
    console.log('Request sent successfully (no-cors mode)');
    
  } catch (error) {
    console.error(`Error with no-cors fetch:`, error);
  }
}

function renderTweets(tweets, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  
  if (!tweets || tweets.length === 0) {
    container.innerHTML = "<p>No tweets found.</p>";
    return;
  }
  
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

  if (!users || users.length === 0) {
    container.innerHTML += "<p>No users found.</p>";
    return;
  }

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