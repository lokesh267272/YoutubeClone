# YouTube Clone

A YouTube clone built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse videos, search, filter by category, create a channel, upload videos, like/dislike, and comment.

---

## Getting Started

You need Node.js and either a MongoDB Atlas account or MongoDB running locally.

### 1. Clone the repo

```bash
git clone https://github.com/lokesh267272/YoutubeClone.git
cd YoutubeClone
```

### 2. Install dependencies

```bash
# backend
cd backend
npm install

# frontend (open a new terminal or go back)
cd ../frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=pick_any_secret_key
```

The frontend already has a `.env` file with:

```
VITE_API_URL=http://localhost:5000/api
```

If your backend runs on a different port, update that too.

### 4. Seed the database (optional but recommended)

This loads 15 real videos across 6 categories, 5 channels, and a demo account so you can test everything right away.

```bash
cd backend
node seed/seedData.js
```

### 5. Run the app

You'll need two terminals open.

**Terminal 1 – backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 – frontend:**
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## Features

- Register and log in with email and password (JWT auth)
- Browse videos on the home page in a grid layout
- Search for videos by title from the header
- Filter videos by category (8 categories available)
- Watch videos on a dedicated video player page
- Like and dislike videos (toggle, mutually exclusive)
- Add, edit, and delete your own comments
- Create a channel after logging in
- Upload, edit, and delete your own videos from your channel page
- Edit your channel info (name, handle, description, banner, profile pic)
- Fully responsive — works on mobile, tablet, and desktop

---

## Demo Account

If you want to test without registering:

- **Email:** test@example.com  
- **Password:** password123

---

## Project Structure

```
YoutubeClone/
├── backend/
│   ├── config/         mongodb connection
│   ├── controllers/    auth, video, channel, comment logic
│   ├── middleware/     JWT auth check
│   ├── models/         User, Video, Channel, Comment schemas
│   ├── routes/         all API routes
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── api/        axios instance
│       ├── components/ Header, Sidebar, VideoCard, CommentSection, etc.
│       ├── context/    AuthContext, SidebarContext
│       ├── pages/      HomePage, LoginPage, RegisterPage, VideoPlayerPage, ChannelPage
│       └── data/       categories and helper functions
│
└── README.md
```

---

## API Routes

**Auth** — `/api/auth`
- `POST /register` — create account
- `POST /login` — log in, get a token back
- `GET /me` — get current logged-in user (requires token)

**Videos** — `/api/videos`
- `GET /` — get all videos, supports `?search=` and `?category=`
- `GET /:id` — get a single video (also increments view count)
- `POST /` — upload a video (auth required)
- `PUT /:id` — update video (owner only)
- `DELETE /:id` — delete video (owner only)
- `PUT /:id/like` — toggle like
- `PUT /:id/dislike` — toggle dislike

**Channels** — `/api/channels`
- `POST /` — create a channel (auth required)
- `GET /:id` — get channel info and its videos
- `PUT /:id` — update channel (owner only)

**Comments** — `/api/comments`
- `GET /:videoId` — get all comments for a video
- `POST /:videoId` — post a comment (auth required)
- `PUT /:videoId/:commentId` — edit your comment
- `DELETE /:videoId/:commentId` — delete your comment

---

## Tech Stack

- **Frontend:** React 19, React Router v7, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express 5, Mongoose, JWT, bcryptjs
- **Database:** MongoDB
