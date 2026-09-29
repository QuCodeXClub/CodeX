import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
  updateEvent,
} from '../controllers/event.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

// Public routes
router.route('/').get(getEvents);
router.route('/:id').get(getEventById);

// Secured admin routes
router.use(verifyJWT);

router.route('/').post(upload.single('coverImage'), logAdminActivity("Admin created a new event"), createEvent);
router.route('/:id')
  .put(upload.single('coverImage'), logAdminActivity(), updateEvent)
  .delete(logAdminActivity(), deleteEvent);

export default router;
