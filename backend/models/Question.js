import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question text']
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Please add the correct answer']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

export default mongoose.model('Question', questionSchema);
