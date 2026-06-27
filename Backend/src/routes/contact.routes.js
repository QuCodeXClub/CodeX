import { Router } from 'express';
import {
  submitContactForm,
  getAllContactMessages,
  markAsRead,
  deleteMessage,
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

export default router;
