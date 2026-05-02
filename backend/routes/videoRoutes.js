import { Router } from 'express';
import {
  getVideos, getVideo, createVideo, updateVideo, deleteVideo,
  likeVideo, dislikeVideo,
} from '../controllers/videoController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.get('/',           getVideos);
router.get('/:id',        getVideo);
router.post('/',          protect, createVideo);
router.put('/:id',        protect, updateVideo);
router.delete('/:id',     protect, deleteVideo);
router.put('/:id/like',   protect, likeVideo);
router.put('/:id/dislike',protect, dislikeVideo);

export default router;
