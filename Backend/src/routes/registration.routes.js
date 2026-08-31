import { Router } from 'express';
import {
  getAllRegistrations,
  updateRegistrationStatus,
  updateRegistrationDetails,
  addManualRegistration,
  bulkRegistration,
} from '../controllers/registration.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(verifyJWT);

router.route('/').get(getAllRegistrations);
router.route('/manual').post(addManualRegistration);
router.route('/bulk').post(upload.single('file'), bulkRegistration);
router.route('/:id').put(updateRegistrationDetails);
router.route('/:id/status').patch(updateRegistrationStatus);

export default router;
