# 🐦 X Feed Viewer — Chrome Extension + FastAPI Backend

A Chrome Extension + FastAPI-powered backend that allows users to securely view their **Twitter (X) feed**, including **photos, videos, and GIFs**, by providing their own authentication tokens. Media is downloaded server-side and served locally for performance and control.

---

## 🚀 Features

- 🔐 Uses your own Twitter auth tokens (`auth_token`, `ct0`)
- 🧵 Fetches your timeline, followers, following, and friends
- 🖼 Downloads and serves images, videos, and GIFs locally via FastAPI
- 🧩 Chrome Extension UI
- ⚙️ Built-in CORS configuration for development and deployment

## 🛠 Backend Setup (FastAPI)
Backend deployed at railway -https://x-feed-extension.up.railway.app/

## Frontend 
Frontend is made using JS , HTML , CSS.

## Project setup 

* Visit chrome://extensions

* Enable Developer Mode

* Click Load unpacked

* Select the extension/ folder

## Using the extension
* Enter your auth_token and ct0 (from your browser cookies)

* Click Fetch
View timeline, followers, following, friends
Media is displayed from the FastAPI backend

##  How to Get Twitter Tokens
To use your own account data:

Open https://X.com

Open DevTools → Application → Cookies

Copy:

auth_token

ct0

Paste into the extension

🛡 These tokens are used only in your browser and are not stored or shared.




