import express from 'express';
import { protect } from '../middleware/auth.js';
import { generateCertificate, verifyCertificate, getUserCertificates } from '../controllers/certificateController.js';

const router = express.Router();

router.get('/verify/:id', verifyCertificate);
router.route('/').post(protect, generateCertificate).get(protect, getUserCertificates);

export default router;
