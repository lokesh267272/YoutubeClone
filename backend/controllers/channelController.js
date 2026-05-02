import Channel from '../models/Channel.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

export const createChannel = async (req, res) => {
  const { channelName, handle, avatarBg, initial, description, links } = req.body;

  if (!channelName) return res.status(400).json({ message: 'Channel name is required' });
  if (!handle) return res.status(400).json({ message: 'Handle is required' });

  try {
    const existing = await Channel.findOne({ handle });
    if (existing) return res.status(400).json({ message: 'Handle already taken' });

    const channel = await Channel.create({
      channelName, handle, avatarBg, initial, description, links,
      owner: req.user.userId,
    });

    await User.findByIdAndUpdate(req.user.userId, { channelId: channel._id });

    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('videos');
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    if (channel.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    const { channelName, description, bannerUrl } = req.body;
    Object.assign(channel, { channelName, description, bannerUrl });
    await channel.save();

    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
