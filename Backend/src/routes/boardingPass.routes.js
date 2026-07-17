import { Router } from 'express';
import { generateBulkBoardingPasses, verifyBoardingPass } from '../controllers/boardingPass.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route for verification
router.route('/verify/:boardingPassId').get(verifyBoardingPass);

// Secured admin route
router.route('/generate-bulk').post(verifyJWT, generateBulkBoardingPasses);

export default router;
