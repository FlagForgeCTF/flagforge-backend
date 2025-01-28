// models/Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  flag: { type: String, required: true }, 
  points: { type: Number, default: 10 },
});

module.exports = mongoose.model('Challenge', challengeSchema);
