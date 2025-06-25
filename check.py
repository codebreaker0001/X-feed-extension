from twikit import Client
import asyncio
# Initialize client
client = Client()

# Set auth_token and ct0 directly in the internal cookie jar
# client.set_cookies()("auth_token", "e14174fd2b2857073b9e6f1949b89fd8b0d5f0c6", domain=".twitter.com")
# client.set_cookies()("ct0", "07ef3b22c97b6f251f021ca252411075f1441ee0cd38b94dd20e8fd2408933a2b5a7191bde02d459bf289fd43a9a3d34ffaa4933195c6b4c0bf02c678c1743a3503482a7be345b42811df4ea5b6e0470", domain=".twitter.com")

client.set_cookies({
    "auth_token": "e14174fd2b2857073b9e6f1949b89fd8b0d5f0c6",
    "ct0": "07ef3b22c97b6f251f021ca252411075f1441ee0cd38b94dd20e8fd2408933a2b5a7191bde02d459bf289fd43a9a3d34ffaa4933195c6b4c0bf02c678c1743a3503482a7be345b42811df4ea5b6e0470"
})

client.save_cookies('cookies.json')
# Perform login using just cookies (no password needed)
# client.login_via_auth_token()

client.load_cookies('cookies.json')

# Fetch the home timeline


async def fetch_home_timeline(count:int = 10):
    tweets = await client.get_timeline(count=count)
    for tweet in tweets:
        print("Tweet ID:", tweet.id)
        print("Text:", tweet.full_text if hasattr(tweet, "full_text") else tweet.text)
        print("Created At:", tweet.created_at)
        print("User:", tweet.user.screen_name if tweet.user else "Unknown")
        print("Likes:", tweet.favorite_count)
        print("Retweets:", tweet.retweet_count)
        # print("Replies:", tweet.replies_count)
        print("-" * 50)
        
# fetch_home_timeline(10)


asyncio.run(fetch_home_timeline(10))