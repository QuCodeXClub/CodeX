import { Router } from 'express';
import { addTeamMember, getTeamMembers, deleteTeamMember, updateTeamMember } from '../controllers/team.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

// Public route
router.route('/').get(getTeamMembers);

// Secured admin routes
router.use(verifyJWT);

router.route('/').post(upload.single('photo'), logAdminActivity(), addTeamMember);
router.route('/:id')
  .patch(upload.single('photo'), logAdminActivity(), updateTeamMember)
  .delete(logAdminActivity(), deleteTeamMember);

export default router;
