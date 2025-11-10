// routes/posts.js
const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');

const Post = require('../models/Post');
const User = require('../models/User');

const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const { postCreateValidation, commentValidation } = require('../utils/validators');

/**
 * Admin routes:
 *  POST /posts        -> create post (admin)
 *  PUT /posts/:id     -> update post (admin)
 *  DELETE /posts/:id  -> delete post (admin)
 *
 * Public/Authenticated:
 *  GET /posts         -> list posts (public)
 *  GET /posts/:id     -> get single post (public)
 *  POST /posts/:id/like -> like/unlike (auth)
 *  POST /posts/:id/comments -> add comment (auth)
 *  PUT /posts/:id/comments/:commentId -> edit comment (auth, author)
 *  DELETE /posts/:id/comments/:commentId -> delete comment (auth, author or admin)
 */

// Create post (admin)
router.post('/', auth, adminOnly, postCreateValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, body } = req.body;
    const post = new Post({ title, body, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Edit post (admin)
router.put('/:id', auth, adminOnly, postCreateValidation, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.title = req.body.title ?? post.title;
    post.body = req.body.body ?? post.body;
    post.updatedAt = Date.now();

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get posts (public) with pagination & simple sorting
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Post.countDocuments();

    res.json({ posts, meta: { page, limit, total } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.author', 'name email')
      .lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like / Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.user.id;
    const likedIndex = post.likes.findIndex((u) => u.equals(userId));

    if (likedIndex === -1) {
      post.likes.push(userId);
      await post.save();
      return res.json({ message: 'Post liked', likesCount: post.likes.length });
    } else {
      post.likes.splice(likedIndex, 1);
      await post.save();
      return res.json({ message: 'Post unliked', likesCount: post.likes.length });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment
// backend/routes/posts.js
const analyzeAndRephrase = require('../utils/aiSentiment.js'); // CommonJS import

router.post('/:id/comments', auth, commentValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const text = req.body.text;

    // Use local sentiment analyzer
    const { sentiment, rephrased } = await analyzeAndRephrase(text);
    if (sentiment === "negative") {
      return res.status(400).json({
        warning: true,
        message: "Your comment seems negative or inappropriate.",
        suggestion: rephrased,
      });
    }

    const comment = {
      author: req.user.id,
      text,
      createdAt: Date.now(),
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await Post.findById(req.params.id).populate(
      "comments.author",
      "name email"
    );

    const lastComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json({
      message: "Comment added successfully",
      comment: lastComment,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error" });
  }
});





// Edit comment (author only)
router.put('/:id/comments/:commentId', auth, commentValidation, async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the comment author can edit this comment' });
    }

    comment.text = req.body.text;
    comment.updatedAt = Date.now();
    await post.save();

    await post.populate('comments.author', 'name email'); // refresh author details
    res.json({ message: 'Comment updated', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete comment (author or admin)
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const isAuthor = comment.author.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
