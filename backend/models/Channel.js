import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    channelName: { type: String, required: true },
    handle:      { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    bannerUrl:   { type: String, default: '' },
    avatarBg:    { type: String, default: '#4d96ff' },
    initial:     { type: String, default: '' },
    links:       [{ type: String }],
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    subscribers: { type: Number, default: 0 },
    videos:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  },
  { timestamps: true }
);

export default mongoose.model('Channel', channelSchema);
