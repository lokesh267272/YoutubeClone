import { Router } from 'express';
import { createChannel, getChannel, updateChannel } from '../controllers/channelController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

// Creating and editing a channel requires an authenticated user.
router.post('/',    protect, createChannel);
router.get('/:id',  getChannel);
router.put('/:id',  protect, updateChannel);

export default router;
