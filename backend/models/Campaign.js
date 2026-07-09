const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a campaign name'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Please specify the platform'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Please add a budget'],
    },
    spent: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Paused'],
      default: 'Active',
    },
    reach: {
      type: Number,
      default: 0,
    },
    ctr: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Campaign', CampaignSchema);
