# 🐦 X Feed Viewer — Chrome Extension + FastAPI Backend

A Chrome Extension + FastAPI-powered backend that allows users to securely view their **Twitter (X) feed**, including **photos, videos, and GIFs**, by providing their own authentication tokens. Media is downloaded server-side and served locally for performance and control.

---

## 🚀 Features

- 🔐 Uses your own Twitter auth tokens (`auth_token`, `ct0`)
- 🧵 Fetches your timeline, followers, following, and friends
- 🖼 Downloads and serves images, videos, and GIFs locally via FastAPI
- 🧩 Chrome Extension UI
- ⚙️ Built-in CORS configuration for development and deployment

---

## 🗂 Project Structure
x-feed-extension/
├── backend/
│ ├── app.py # FastAPI backend logic
│ ├── media/ # Downloaded tweet media (auto-created)
│ └── requirements.txt # Python dependencies
├── extension/
│ ├── popup.html # Extension UI
│ ├── popup.js # JavaScript logic for fetching & rendering
│ ├── styles.css # Styles for the extension popup
│ └── manifest.json # Chrome Extension manifest
├── README.md # You are here 📘


---

## 🛠 Backend Setup (FastAPI)

### ✅ Install Python dependencies

```bash
cd backend
pip install -r requirements.txt

fastapi
uvicorn
twikit
pydantic

uvicorn app:app --reload



