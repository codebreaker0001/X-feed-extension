from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from twikit import Client
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenInput(BaseModel):
    auth_token: str
    ct0: str

@app.post("/timeline")
async def get_timeline(data: TokenInput):
    client = Client()
    client.set_cookies({
        "auth_token": data.auth_token,
        "ct0": data.ct0
    })

    tweets = await client.get_timeline(count=10)

    tweet_list = []

    for tweet in tweets:
        media_urls = []
        try:
            if hasattr(tweet, "extended_entities") and tweet.extended_entities and "media" in tweet.extended_entities:
                media_items = tweet.extended_entities["media"]
                media_urls = [item["media_url_https"] for item in media_items]
            elif hasattr(tweet, "entities") and tweet.entities and "media" in tweet.entities:
                media_items = tweet.entities["media"]
                media_urls = [item["media_url_https"] for item in media_items]
        except Exception as e:
            print(f"Error getting media for tweet {tweet.id}: {e}")
            media_urls = []
        media_url = media_urls[0] if media_urls else None

        tweet_list.append({
            "id": tweet.id,
            "text": getattr(tweet, "full_text", tweet.text),
            "user": tweet.user.screen_name if tweet.user else "Unknown",
            "created_at": tweet.created_at,
            "likes": tweet.favorite_count,
            "retweets": tweet.retweet_count,
            "replies": getattr(tweet, "replies_count", 0),  # ✅ Safe replies count
            "profile_image": "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            "name": tweet.user.name if tweet.user else "Unknown",
            "images": media_urls
        })
    return {"tweets": tweet_list}

@app.post("/getUserTweets")
async def get_user_tweets(data: TokenInput):
    client = Client()
    client.set_cookies({
        "auth_token": data.auth_token,
        "ct0": data.ct0
    })

    # userId = await client.user_id()
    tweets = await client.get_user_tweets(count=10)

    tweet_list = []

    for tweet in tweets:
        media_urls = []
        try:
            if hasattr(tweet, "extended_entities") and tweet.extended_entities and "media" in tweet.extended_entities:
                media_items = tweet.extended_entities["media"]
                media_urls = [item["media_url_https"] for item in media_items]
            elif hasattr(tweet, "entities") and tweet.entities and "media" in tweet.entities:
                media_items = tweet.entities["media"]
                media_urls = [item["media_url_https"] for item in media_items]
        except Exception as e:
            print(f"Error getting media for tweet {tweet.id}: {e}")
            media_urls = []
        media_url = media_urls[0] if media_urls else None

        tweet_list.append({
            "id": tweet.id,
            "text": getattr(tweet, "full_text", tweet.text),
            "user": tweet.user.screen_name if tweet.user else "Unknown",
            "created_at": tweet.created_at,
            "likes": tweet.favorite_count,
            "retweets": tweet.retweet_count,
            "replies": getattr(tweet, "replies_count", 0),  # ✅ Safe replies count
            "profile_image": "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            "name": tweet.user.name if tweet.user else "Unknown",
            "images": media_urls
        })
    return {"tweets": tweet_list}



@app.post("/getUserFollowers")

async def get_user_followers(data :TokenInput):
    client = Client()
    client.set_cookies({
        "auth_token": data.auth_token,
        "ct0": data.ct0
    })

    userId = await client.user_id()
    followers = await client.get_user_followers(userId, count=10)

    for f in followers:
        print(f)
    follower_list = []

    for follower in followers:
        follower_list.append({
            "id": follower.id,
            "name": follower.name,
            "screen_name": follower.screen_name,
            # "profile_image": follower.profile_image_url_https
        })
    
    return {"followers": follower_list}


@app.post("/getUserFollowing")
async def get_user_following(data: TokenInput):
    client = Client()
    client.set_cookies({
        "auth_token": data.auth_token,
        "ct0": data.ct0
    })

    userId = await  client.user_id()
    following = await client.get_user_following(userId, count=10)

    
    for f in following:
        print(f)
    following_list = []

    for user in following:
        following_list.append({
            "id": user.id,
            "name": user.name,
            "screen_name": user.screen_name,
            # "profile_image": user.profile_image_url_https
        })
    
    return {"following": following_list}

app.post("/getUserFriends")
async def get_user_friends(data: TokenInput):
    client = Client()
    client.set_cookies({
        "auth_token": data.auth_token,
        "ct0": data.ct0
    })

    userId = await client.user_id()
    friends = await client.get_latest_friends(userId, count=10)

    friend_list = []

    for friend in friends:
        friend_list.append({
            "id": friend.id,
            "name": friend.name,
            "screen_name": friend.screen_name,
            # "profile_image": friend.profile_image_url_https
        })
    
    return {"friends": friend_list}



asyncio.run(get_user_followers())