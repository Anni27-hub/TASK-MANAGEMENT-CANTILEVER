const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const Campaign = require('../models/Campaign');
const ArtAsset = require('../models/ArtAsset');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_token_for_authentication_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Check if there is at least one admin registered
// @route   GET /api/auth/has-admin
// @access  Public
router.get('/has-admin', async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    res.status(200).json({ success: true, hasAdmin: adminCount > 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Seed default tasks for the user so it looks like the mockup immediately
    await Task.create([
      {
        title: 'Salsile project brief',
        description: 'Salsile Inc. is a well-established fashion retailer specializing in high-quality clothing and accessories for men and women. The client is looking to revamp their existing e-commerce website to enhance user experience, improve overall aesthetics, and increase online sales. The new design should reflect their brand identity as a modern, and customer-centric fashion store.',
        status: 'In Progress',
        priority: 'High',
        user: user._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        subTasks: [
          { title: 'Prepare for the design meeting', completed: false }
        ]
      },
      {
        title: 'Design Management',
        description: 'We have to manage all our design project everyday in one tool. This includes scheduling weekly feedback sessions, updating design templates, and tracking designer workloads.',
        status: 'Pending',
        priority: 'Medium',
        user: user._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        subTasks: [
          { title: 'Review Figma file layouts', completed: true },
          { title: 'Update project timeline board', completed: false }
        ]
      },
      {
        title: 'Daily task due',
        description: 'There is always some daily task we have in our hand which we have to done. Keep track of daily standalone syncs and design critiques.',
        status: 'Pending',
        priority: 'Low',
        user: user._id,
        dueDate: new Date(),
        subTasks: [
          { title: 'Answer standup Slack channel', completed: false }
        ]
      }
    ]);

    // Seed default campaigns
    await Campaign.create([
      { user: user._id, name: 'Salsile Summer Launch', platform: 'Instagram', budget: 5000, spent: 3200, status: 'Active', reach: 240000, ctr: 4.8 },
      { user: user._id, name: 'Google Search Traffic', platform: 'Google Ads', budget: 8000, spent: 6500, status: 'Active', reach: 520000, ctr: 6.2 },
      { user: user._id, name: 'TikTok Trend Video', platform: 'TikTok', budget: 4000, spent: 4000, status: 'Completed', reach: 810000, ctr: 8.4 },
      { user: user._id, name: 'Weekly Newsletter Blast', platform: 'Email', budget: 1000, spent: 450, status: 'Active', reach: 45000, ctr: 12.1 }
    ]);

    // Seed default art assets
    await ArtAsset.create([
      { user: user._id, title: 'Salsile Brand Logo v2', category: 'Logo', status: 'Approved', theme: 'theme-purple' },
      { user: user._id, title: 'Landing Page Banner Design', category: 'Banner', status: 'In Review', theme: 'theme-blue' },
      { user: user._id, title: 'Summer Collection Art Illustration', category: 'Illustration', status: 'Draft', theme: 'theme-yellow' },
      { user: user._id, title: 'E-commerce Checkout Wireframe', category: 'UI/UX', status: 'Approved', theme: 'theme-grey' }
    ]);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user (must explicitly select password since it has select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get current user details
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // If changing password, verify old password first
    if (req.body.password && req.body.currentPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Current password does not match' });
      }
      user.password = req.body.password;
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
