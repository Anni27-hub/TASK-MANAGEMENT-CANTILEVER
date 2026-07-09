const express = require('express');
const Campaign = require('../models/Campaign');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's campaigns
// @route   GET /api/campaigns
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: campaigns.length, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, platform, budget, spent, status, reach, ctr } = req.body;

    const campaign = await Campaign.create({
      user: req.user.id,
      name,
      platform,
      budget,
      spent: spent || 0,
      status: status || 'Active',
      reach: reach || 0,
      ctr: ctr || 0,
    });

    res.status(201).json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
