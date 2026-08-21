import { Router } from 'express';
import {
  getBackgroundJobs,
  getJobStats,
  retryJob,
  deleteJob,
  clearCompletedJobs,
} from '../controllers/job.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // Protect all job routes for admin only

router.route('/').get(getBackgroundJobs);
router.route('/stats').get(getJobStats);
router.route('/clear-completed').delete(clearCompletedJobs);
router.route('/:id').delete(deleteJob);
router.route('/:id/retry').post(retryJob);

export default router;
