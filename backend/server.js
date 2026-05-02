import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes    from './routes/authRoutes.js';
import videoRoutes   from './routes/videoRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();
// Connect before serving requests so the API starts with a live database.
connectDB();

const app = express();

// Allow the local frontend to call the API during development.
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Mount each feature area under its own API namespace.
app.use('/api/auth',     authRoutes);
app.use('/api/videos',   videoRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (_req, res) => res.json({ message: 'YouTube Clone API is running' }));

const PORT = process.env.PORT || 5000;
// Start the API on the configured port, or fall back to 5000 locally.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
