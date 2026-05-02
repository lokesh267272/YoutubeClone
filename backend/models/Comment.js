import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    // Comments belong to a video and store the author details needed by the UI.
    videoId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    username: { type: String, required: true },
    text:     { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
