from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from twikit import Client
import asyncio

from fastapi.staticfiles import StaticFiles

# app = FastAPI()

import os 

app = FastAPI()

app.mount("/media", StaticFiles(directory="media"), name="media")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class TokenInput(BaseModel):
    auth_token: str
    ct0: str

@app.get("/")
async def root():
    return {"message": "Welcome to the X Feed API!"}

@app.post("/timeline")
async def get_timeline(data: TokenInput):
    client = Client()
    client.set_cookies({
        "auth_token": data.auth_token,
        "ct0": data.ct0
    })

    tweets = await client.get_timeline(count=10)

    tweet_list = []

    media_dir = "media"
    os.makedirs(media_dir, exist_ok=True)
    for tweet in tweets:
        media_urls = []
        
        for i , media in enumerate(tweet.media):
            
            file_ext = "jpg"
            if media.type == "photo":
                # await media.download(f'media_{i}.jpg')
                file_ext = "jpg"
            
            if media.type == "video":
                file_ext = "mp4"
                # await media.streams[-1].download(f'media_{i}.mp4')
                
            if media.type == 'animated_gif':
                file_ext = "mp4"
                # await media.streams[-1].download(f'media_{i}.mp4')
                
            file_name = f"{tweet.id}_{i}.{file_ext}"
            file_path = os.path.join(media_dir, file_name)
            
            if media.type == "photo":
                await media.download(file_path)
            elif media.type in ["video", "animated_gif"]:
                await media.streams[-1].download(file_path)

            media_url = f"/media/{file_name}"
            media_urls.append({
                "type": media.type,
                "url": media_url,
                "thumbnail": media_url,  # You can use the same for now
                "video_url": media_url if media.type in ["video", "animated_gif"] else None
            })

        tweet_list.append({
            "id": tweet.id,
            "text": getattr(tweet, "full_text", tweet.text),
            "user": tweet.user.screen_name if tweet.user else "Unknown",
            "created_at": tweet.created_at,
            "likes": tweet.favorite_count,
            "retweets": tweet.retweet_count,
            "replies": getattr(tweet, "replies_count", 0),  # ✅ Safe replies count
            "profile_image": 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
            "name": tweet.user.name if tweet.user else "Unknown",
            "media": media_urls
        })
    print(tweet_list)
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

@app.post("/getUserFriends")
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



# asyncio.run(get_user_followers())