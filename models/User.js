const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
  googleId: { 
    type: String, 
    unique: true },
  email: { 
    type: String, 
    unique: true },
  displayName: String,
  avatar: String,
  role: {
    type: String,
    enum: ['participant', 'admin'],
    default: 'participant'
  },
  team: mongoose.Schema.Types.ObjectId,
  score: { type: Number, default: 0 },
  solvedChallenges: [{
    challenge: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);