const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[A-Za-z0-9]{6,8}$/,
    index: true
  },
  targetUrl: {
    type: String,
    required: true,
    trim: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  lastClicked: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
linkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Link', linkSchema);