import { Router } from 'express';
import { verifyJWT, verifySuperAdmin } from '../middlewares/auth.middleware.js';
import { superAdminLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/adminManagement.controller.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

// Protect all superAdmin routes with rate limiting, JWT, and verifySuperAdmin
router.use(superAdminLimiter, verifyJWT, verifySuperAdmin);

router
  .route('/admins')
  .get(getAllAdmins)
  .post(
    logAdminActivity(
      (req) => `Super Admin added admin account ${req.body?.name} (${req.body?.email})`
    ),
    createAdmin
  );

router
  .route('/admins/:id')
  .patch(
    logAdminActivity(
      (req) => `Super Admin updated admin account (#${req.params.id})`
    ),
    updateAdmin
  )
  .delete(
    logAdminActivity(
      (req) => `Super Admin removed admin account (#${req.params.id})`
    ),
    deleteAdmin
  );

export default router;
