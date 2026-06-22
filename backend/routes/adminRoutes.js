import express from 'express';
import { protect, admin, teacherOrAdmin } from '../middleware/auth.js';
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

router.use(protect);

router.route('/users')
  .get(admin, getUsers);
router.route('/users/:id/role')
  .put(admin, updateUserRole);

router.route('/analytics')
  .get(teacherOrAdmin, getAnalytics);

router.route('/questions')
  .get(teacherOrAdmin, getQuestions)
  .post(teacherOrAdmin, addQuestion);

router.route('/questions/:id')
  .put(teacherOrAdmin, updateQuestion)
  .delete(teacherOrAdmin, deleteQuestion);

export default router;
