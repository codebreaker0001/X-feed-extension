document.getElementById("fetch").addEventListener("click", async () => {
  const auth_token = document.getElementById("auth_token").value;
  const ct0 = document.getElementById("ct0").value;

  const res = await fetch("http://localhost:8000/timeline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ auth_token, ct0 })
  });

  const data = await res.json();
  const container = document.getElementById("tweets");
  container.innerHTML = "";

  data.tweets.forEach(tweet => {
    const el = document.createElement("div");
    el.className = "tweet";
    el.innerHTML = `
      <strong>@${tweet.user}</strong><br/>
      <p>${tweet.text}</p>
      <small>❤️ ${tweet.likes} 🔁 ${tweet.retweets} 💬 ${tweet.replies}</small>
      <hr/>
    `;
    container.appendChild(el);
  });
});
