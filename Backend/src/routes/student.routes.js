import { Router } from 'express';
import { registerStudent, getRegistrationPublicStatus } from '../controllers/student.controller.js';

const router = Router();

// Public routes
router.route('/registration-status').get(getRegistrationPublicStatus);
router.route('/register').post(registerStudent);

export default router;

