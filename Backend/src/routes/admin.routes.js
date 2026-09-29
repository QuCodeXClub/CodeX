import { Router } from 'express';
import {
  loginAdmin,
  verifyOtp,
  logoutAdmin,
  updateProfile,
  requestPasswordChange,
  changePassword,
  getAdminSessions,
  killSession,
  getCurrentAdmin,
  getDashboardMetrics,
  getAdminRegistrationStatus,
  updateAdminRegistrationStatus,
} from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { sendAnnouncement, getAnnouncementsHistory } from '../controllers/announcement.controller.js';
import { getActivityLogs, getAccessLogs, clearActivityLogs, clearAccessLogs } from '../controllers/log.controller.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

router.route('/login').post(loginAdmin);
router.route('/verify-otp').post(verifyOtp);

// Secured routes
router.route('/logout').post(verifyJWT, logAdminActivity("Admin logged out"), logoutAdmin);
router.route('/profile').patch(verifyJWT, upload.single('profilePhoto'), logAdminActivity("Admin updated profile"), updateProfile);
router.route('/request-password-change').post(verifyJWT, logAdminActivity("Admin requested password change"), requestPasswordChange);
router.route('/change-password').post(verifyJWT, logAdminActivity("Admin changed password"), changePassword);
router.route('/sessions').get(verifyJWT, getAdminSessions);
router.route('/sessions/:id').delete(verifyJWT, logAdminActivity((req) => `Admin killed session ${req.params.id}`), killSession);
router.route("/current").get(verifyJWT, getCurrentAdmin);
router.route("/dashboard").get(verifyJWT, getDashboardMetrics);
router.route("/announcement").post(verifyJWT, logAdminActivity("Admin sent an announcement"), sendAnnouncement);
router.route("/announcements-history").get(verifyJWT, getAnnouncementsHistory);
router
  .route("/registration-status")
  .get(verifyJWT, getAdminRegistrationStatus)
  .patch(verifyJWT, logAdminActivity("Admin updated registration status"), updateAdminRegistrationStatus);

// Logs routes
router.route('/logs/activity').get(verifyJWT, getActivityLogs).delete(verifyJWT, clearActivityLogs);
router.route('/logs/access').get(verifyJWT, getAccessLogs).delete(verifyJWT, clearAccessLogs);

export default router;

