import { Router } from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/faq.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route for fetching FAQs
router.route('/').get(getFAQs);

// Secured routes (Admin only)
router.use(verifyJWT);

router.route('/').post(createFAQ);
router.route('/:id').patch(updateFAQ).delete(deleteFAQ);

export default router;
