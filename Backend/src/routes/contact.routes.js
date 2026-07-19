import { Router } from 'express';
import {
  submitContactForm,
  getAllContactMessages,
  markAsRead,
  deleteMessage,
  replyToMessage,
} from '../controllers/contact.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route for submitting contact form
router.route('/').post(submitContactForm);

// Secured routes (Admin only)
router.use(verifyJWT);

router.route('/').get(getAllContactMessages);
router.route('/:id').delete(deleteMessage);
router.route('/:id/read').patch(markAsRead);
router.route('/:id/reply').post(replyToMessage);

export default router;
