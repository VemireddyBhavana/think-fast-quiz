import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  quizCategory: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  dateIssued: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Certificate', certificateSchema);
