import { Router } from 'express';
import { loginAdmin, verifyOtp, logoutAdmin, updateProfile, changePassword, getAdminSessions, killSession } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/login').post(loginAdmin);
router.route('/verify-otp').post(verifyOtp);

// Secured routes
router.route('/logout').post(verifyJWT, logoutAdmin);
router.route('/profile').patch(verifyJWT, updateProfile);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/sessions').get(verifyJWT, getAdminSessions);
router.route('/sessions/:id').delete(verifyJWT, killSession);

export default router;
