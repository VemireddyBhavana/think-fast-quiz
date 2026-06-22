import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, // URL or lucide icon name
    default: 'Trophy'
  },
  type: {
    type: String,
    enum: ['QUIZ_COUNT', 'PERFECT_SCORE', 'STREAK', 'SCORE_PERCENTAGE', 'FIRST_QUIZ'],
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  xpReward: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

export default mongoose.model('Achievement', achievementSchema);
