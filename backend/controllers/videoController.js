import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import Comment from '../models/Comment.js';

export const getVideos = async (req, res) => {
  const { search, category } = req.query;
  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category && category !== 'All') query.category = category;

  try {
    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createVideo = async (req, res) => {
  const { title, thumbnailUrl, videoUrl, description, duration, channelId,
          channelName, channelAvatarBg, channelInitial, category } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const video = await Video.create({
      title, thumbnailUrl, videoUrl, description, duration,
      channelId, channelName, channelAvatarBg, channelInitial, category,
      uploader: req.user.userId,
    });

    await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    Object.assign(video, { title, description, thumbnailUrl, videoUrl, category });
    await video.save();

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    await Promise.all([
      video.deleteOne(),
      Channel.findByIdAndUpdate(video.channelId, { $pull: { videos: video._id } }),
      Comment.deleteMany({ videoId: video._id }),
    ]);

    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const likeVideo = async (req, res) => {
  const userId = req.user.userId;
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const alreadyLiked = video.likes.map(String).includes(userId);
    if (alreadyLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }
    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const dislikeVideo = async (req, res) => {
  const userId = req.user.userId;
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const alreadyDisliked = video.dislikes.map(String).includes(userId);
    if (alreadyDisliked) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }
    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
