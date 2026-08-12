import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  generateSpecialUtr,
  getAllSpecialUtrs,
  deleteSpecialUtr,
} from '../controllers/specialUtr.controller.js';

const router = Router();

// All Special UTR routes require admin authentication
router.use(verifyJWT);

router.route('/')
  .get(getAllSpecialUtrs)
  .post(generateSpecialUtr);

router.route('/:id')
  .delete(deleteSpecialUtr);

export default router;
