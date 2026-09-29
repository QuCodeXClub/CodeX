import { Router } from 'express';
import { generateBulkBoardingPasses, verifyBoardingPass, getAllBoardingPasses } from '../controllers/boardingPass.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

// Public route for verification
router.route('/verify/:boardingPassId').get(verifyBoardingPass);

// Secured admin route
router.route('/').get(verifyJWT, getAllBoardingPasses);
router.route('/generate-bulk').post(verifyJWT, logAdminActivity("Admin generated bulk boarding passes"), generateBulkBoardingPasses);

export default router;
