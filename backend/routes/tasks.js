const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply auth protection middleware to all task routes
router.use(protect);

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy, order } = req.query;
    
    // Build query object based on filters
    const query = { user: req.user.id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    } else {
      // Default: Sort by created date descending
      sortOptions.createdAt = -1;
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this task' });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
    }

    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
