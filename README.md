# YouTube Clone — MERN Stack

A full-stack YouTube clone built with MongoDB, Express, React (Vite), and Node.js. Supports user authentication, video browsing, channel management, comments, likes/dislikes, search, and category filtering.

---

## Features

- **Authentication** — Register, login, logout with JWT (7-day expiry)
- **Home Page** — Video grid with real-time search and category filtering
- **Video Player** — HTML5 video player, like/dislike toggle, expandable description, view count
- **Comments** — Add, edit, delete comments (own comments only)
- **Channel Page** — Create channel, upload videos, edit/delete own videos, subscribe button
- **Responsive Design** — Mobile, tablet, and desktop layouts
- **Seed Data** — 12+ pre-loaded videos across 6+ categories for evaluators

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), React Router v6, Axios, CSS Modules / Tailwind |
| Backend | Node.js, Express.js, ES Modules |
| Database | MongoDB (Atlas or local) + Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Dev Tools | Nodemon, dotenv, cors |

---

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account **or** MongoDB installed locally

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/lokesh267272/YoutubeClone.git
cd YoutubeClone
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables

**`backend/.env`** — create this file:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/youtubeclone
JWT_SECRET=your_super_secret_key_here
```

**`frontend/.env`** — already present:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the database

```bash
cd backend
node seed/seedData.js
```

This inserts:
- 1 default user (`test@example.com` / `password123`)
- 1 channel owned by that user
- 12+ videos across 6+ categories
- Sample comments on various videos

### 5. Run both servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Server runs at `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
App runs at `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port for Express server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `my_secret_key` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for backend API | `http://localhost:5000/api` |

---

## API Endpoint Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns JWT + user |
| GET | `/me` | Yes | Get current user from token |

### Videos — `/api/videos`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Get all videos (`?search=&category=`) |
| GET | `/:id` | No | Get single video + increment views |
| POST | `/` | Yes | Upload video |
| PUT | `/:id` | Yes | Update video (owner only) |
| DELETE | `/:id` | Yes | Delete video (owner only) |
| PUT | `/:id/like` | Yes | Toggle like |
| PUT | `/:id/dislike` | Yes | Toggle dislike |

### Channels — `/api/channels`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/` | Yes | Create channel |
| GET | `/:id` | No | Get channel + its videos |
| PUT | `/:id` | Yes | Update channel (owner only) |

### Comments — `/api/comments`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/:videoId` | No | Get all comments for a video |
| POST | `/:videoId` | Yes | Add comment |
| PUT | `/:videoId/:commentId` | Yes | Edit comment (author only) |
| DELETE | `/:videoId/:commentId` | Yes | Delete comment (author only) |

---

## Demo Account

After seeding, you can log in immediately with:

| Field | Value |
|-------|-------|
| Email | `test@example.com` |
| Password | `password123` |

---

## Project Structure

```
YoutubeClone/
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios instance with JWT interceptor
│   │   ├── components/    # Header, Sidebar, FilterBar, VideoCard, CommentSection, CreateChannelModal
│   │   ├── context/       # AuthContext (JWT + user state)
│   │   ├── data/          # mockData.js (formatting helpers + seed categories)
│   │   └── pages/         # HomePage, LoginPage, RegisterPage, VideoPlayerPage, ChannelPage
│   └── .env
│
├── backend/
│   ├── config/            # MongoDB connection
│   ├── controllers/       # authController, videoController, channelController, commentController
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # User, Video, Channel, Comment (Mongoose schemas)
│   ├── routes/            # authRoutes, videoRoutes, channelRoutes, commentRoutes
│   ├── seed/              # seedData.js
│   └── .env
│
└── README.md
```

---

## Git Commits

This project was built incrementally with 30+ commits following the pattern:
```
feat: initialize project structure and git repo
feat: set up React frontend with Vite
feat: add mock data for videos and channels
...
feat: connect ChannelPage to backend
docs: add README with setup instructions
```

---

## License

Built for academic submission. All video/thumbnail content is sourced from publicly available placeholder services.
