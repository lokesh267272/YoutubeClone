import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const comment = await Comment.create({
      videoId: req.params.videoId,
      userId: req.user.userId,
      username: req.user.username,
      text: text.trim(),
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const editComment = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    comment.text = text.trim();
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
