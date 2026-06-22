import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { 
  getUsers, 
  updateUserRole, 
  getAnalytics, 
  getQuestions, 
  addQuestion, 
  updateQuestion, 
  deleteQuestion 
} from '../controllers/adminController.js';

const router = express.Router();

// All routes are protected and require admin
router.use(protect, admin);

router.route('/users').get(getUsers);
router.route('/users/:id/role').put(updateUserRole);
router.route('/analytics').get(getAnalytics);

router.route('/questions')
  .get(getQuestions)
  .post(addQuestion);

router.route('/questions/:id')
  .put(updateQuestion)
  .delete(deleteQuestion);

export default router;
