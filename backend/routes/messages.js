const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Middleware to check if admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Access denied: Admins only' });
  }
};

// @desc    Get user's own message history
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get all chat threads for admins
// @route   GET /api/messages/admin/threads
// @access  Private/Admin
router.get('/admin/threads', protect, adminOnly, async (req, res) => {
  try {
    // Group messages by user and find the last message
    const threads = await Message.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$user',
          lastMessage: { $first: '$text' },
          lastMessageTime: { $first: '$createdAt' },
          senderName: { $first: '$senderName' }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    // Populate user details for each thread
    const populatedThreads = await Promise.all(
      threads.map(async (thread) => {
        const userObj = await User.findById(thread._id).select('name email');
        return {
          ...thread,
          user: userObj
        };
      })
    );

    res.status(200).json({ success: true, threads: populatedThreads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get a specific user's chat thread details for admins
// @route   GET /api/messages/admin/thread/:userId
// @access  Private/Admin
router.get('/admin/thread/:userId', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find({ user: req.params.userId }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
