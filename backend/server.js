import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/videos',  videoRoutes);
// app.use('/api/channels', channelRoutes);
// app.use('/api/comments', commentRoutes);

app.get('/', (_req, res) => res.json({ message: 'YouTube Clone API is running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
