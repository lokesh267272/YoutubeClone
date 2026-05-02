import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatarBg: { type: String, default: '#4d96ff' },
    channelId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
