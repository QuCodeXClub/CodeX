import { Router } from 'express';
import { createEvent, getEvents, deleteEvent, updateEvent } from '../controllers/event.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Public route
router.route('/').get(getEvents);

// Secured admin routes
router.use(verifyJWT);

router.route('/').post(upload.single('coverImage'), createEvent);
router.route('/:id')
  .patch(upload.single('coverImage'), updateEvent)
  .delete(deleteEvent);

export default router;
