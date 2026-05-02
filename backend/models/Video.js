import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true },
    thumbnailUrl:    { type: String, default: '' },
    videoUrl:        { type: String, default: '' },
    description:     { type: String, default: '' },
    duration:        { type: String, default: '' },
    channelId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    channelName:     { type: String, default: '' },
    channelAvatarBg:   { type: String, default: '#4d96ff' },
    channelInitial:    { type: String, default: '' },
    channelProfileUrl: { type: String, default: '' },
    uploader:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views:           { type: Number, default: 0 },
    likes:           [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category:        { type: String, default: 'Web Development' },
    uploadDate:      { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Video', videoSchema);
