import { Router } from 'express';
import {
  getAllRegistrations,
  updateRegistrationStatus,
  updateRegistrationDetails,
  addManualRegistration,
  bulkRegistration,
  logExport,
} from '../controllers/registration.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(verifyJWT);

router.route('/').get(getAllRegistrations);
router.route('/manual').post(logAdminActivity("Admin added a manual registration"), addManualRegistration);
router.route('/bulk').post(upload.single('file'), logAdminActivity("Admin processed bulk registrations"), bulkRegistration);
router.route('/log-export').post(logAdminActivity(), logExport);
router.route('/:id').put(logAdminActivity(), updateRegistrationDetails);
router.route('/:id/status').patch(logAdminActivity(), updateRegistrationStatus);

export default router;
