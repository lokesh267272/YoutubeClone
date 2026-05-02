import { Router } from 'express';
import { getComments, addComment, editComment, deleteComment } from '../controllers/commentController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

// Anyone can read comments, but writes stay behind auth.
router.get('/:videoId',                   getComments);
router.post('/:videoId',         protect, addComment);
router.put('/:videoId/:commentId',  protect, editComment);
router.delete('/:videoId/:commentId',protect, deleteComment);

export default router;
