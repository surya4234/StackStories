// models/Post.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 300 },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin who posted
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // user ids
  comments: [CommentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
