from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from twikit import Client
import asyncio

app = FastAPI()

# Allow requests from your extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your extension origin if needed
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
        tweet_list.append({
            "id": tweet.id,
            "text": getattr(tweet, "full_text", tweet.text),
            "user": tweet.user.screen_name if tweet.user else "Unknown",
            "created_at": tweet.created_at,
            "likes": tweet.favorite_count,
            "retweets": tweet.retweet_count,
            # "replies": tweet.replies_count
        })

    return {"tweets": tweet_list}
