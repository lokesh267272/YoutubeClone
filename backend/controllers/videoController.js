import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import Comment from '../models/Comment.js';

export const getVideos = async (req, res) => {
  const { search, category } = req.query;
  // Build a simple Mongo query from the current feed filters.
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
    // Increment views as part of the fetch so playback updates the count.
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
    // Store a snapshot of channel display data so cards can render without extra joins.
    const video = await Video.create({
      title, thumbnailUrl, videoUrl, description, duration,
      channelId, channelName, channelAvatarBg, channelInitial, category,
      uploader: req.user.userId,
    });

    // Push the new video id onto the owning channel as well.
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
    // Only the uploader can change a video's details.
    if (video.uploader.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    // Patch only the editable fields coming from the modal form.
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
    // Deletion is limited to the user who uploaded the video.
    if (video.uploader.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    // Remove the video itself and clean up related channel and comment data.
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

    // Likes toggle on and off, and clear any existing dislike from the same user.
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

    // Dislikes mirror the like logic so a user can only hold one reaction.
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
