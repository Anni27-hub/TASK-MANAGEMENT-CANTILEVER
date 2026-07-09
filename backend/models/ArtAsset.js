const mongoose = require('mongoose');

const ArtAssetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add an asset title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify the category'],
      trim: true,
    },
    theme: {
      type: String,
      required: [true, 'Please specify the theme gradient'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'In Review', 'Approved'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ArtAsset', ArtAssetSchema);
