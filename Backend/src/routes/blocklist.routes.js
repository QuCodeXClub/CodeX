import { Router } from 'express';
import {
  getBlocklist,
  getBlocklistStats,
  addBlockedEmail,
  removeBlockedEmail,
} from '../controllers/blocklist.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // Secure all blocklist routes for admins

router.route('/').get(getBlocklist).post(addBlockedEmail);
router.route('/stats').get(getBlocklistStats);
router.route('/:id').delete(removeBlockedEmail);

export default router;
