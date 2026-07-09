const express = require('express');
const ArtAsset = require('../models/ArtAsset');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's art assets
// @route   GET /api/art
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const assets = await ArtAsset.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: assets.length, assets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Create new art asset
// @route   POST /api/art
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, theme, status } = req.body;

    const asset = await ArtAsset.create({
      user: req.user.id,
      title,
      category,
      theme,
      status: status || 'Draft',
    });

    res.status(201).json({ success: true, asset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
