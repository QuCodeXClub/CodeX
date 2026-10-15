import { Router } from 'express';
import { registerStudent, getRegistrationPublicStatus } from '../controllers/student.controller.js';
import { publicSubmissionLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Public routes
router.route('/registration-status').get(getRegistrationPublicStatus);
router.route('/register').post(publicSubmissionLimiter, registerStudent);

export default router;

