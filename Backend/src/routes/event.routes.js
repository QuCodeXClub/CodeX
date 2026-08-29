import { Router } from 'express';
import { createEvent, getEvents, deleteEvent, updateEvent } from '../controllers/event.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Public routes
router.route('/').get(getEvents);
router.route('/:id').get(getEventById);

// Secured admin routes
router.use(verifyJWT);

router.route('/').post(upload.single('coverImage'), createEvent);
router.route('/:id')
  .put(upload.single('coverImage'), updateEvent)
  .delete(deleteEvent);

export default router;
