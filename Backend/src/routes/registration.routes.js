import { Router } from 'express';
import { getAllRegistrations, updateRegistrationStatus } from '../controllers/registration.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(verifyJWT);

router.route('/').get(getAllRegistrations);
router.route('/:id/status').patch(updateRegistrationStatus);

export default router;
