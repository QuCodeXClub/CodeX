import { Router } from 'express';
import {
  generateBulkCertificates,
  verifyCertificate,
  getLatestSignature,
  getAllCertificates,
  getCertificateBatches,
  getCertificateBatchById,
  approveCertificateBatch,
  rejectCertificateBatch,
  updateCertificateBatch,
  deleteCertificate,
  resendCertificateEmail,
  exportBatchCertificatesCsv,
} from '../controllers/certificate.controller.js';
import { verifyJWT, verifySuperAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { logAdminActivity } from '../middlewares/log.middleware.js';

const router = Router();

// Public route for verification
router.route('/verify/:certificateId').get(verifyCertificate);

// Secured admin routes
router.route('/').get(verifyJWT, getAllCertificates);
router.route('/:id').delete(
  verifyJWT,
  verifySuperAdmin,
  logAdminActivity((req) => `Super Admin deleted certificate #${req.params.id}`),
  deleteCertificate
);
router.route('/:id/resend').post(
  verifyJWT,
  logAdminActivity((req) => `Admin resent certificate #${req.params.id}`),
  resendCertificateEmail
);
router.route('/latest-signature').get(verifyJWT, getLatestSignature);
router.route('/generate-bulk').post(
  verifyJWT,
  upload.single('signatureImage'),
  logAdminActivity((req) =>
    req.admin?.role === 'SuperAdmin'
      ? 'Super Admin generated bulk certificates directly'
      : 'Admin submitted bulk certificates for approval'
  ),
  generateBulkCertificates
);

// Batch approvals & review routes
router.route('/batches').get(verifyJWT, getCertificateBatches);
router.route('/batches/:id/export').get(verifyJWT, exportBatchCertificatesCsv);
router
  .route('/batches/:id')
  .get(verifyJWT, getCertificateBatchById)
  .put(
    verifyJWT,
    upload.single('signatureImage'),
    logAdminActivity((req) => `Updated certificate batch #${req.params.id}`),
    updateCertificateBatch
  );
router.route('/batches/:id/approve').patch(
  verifyJWT,
  verifySuperAdmin,
  logAdminActivity((req) => `Super Admin approved certificate batch #${req.params.id}`),
  approveCertificateBatch
);
router.route('/batches/:id/reject').patch(
  verifyJWT,
  verifySuperAdmin,
  logAdminActivity((req) => `Super Admin rejected certificate batch #${req.params.id}`),
  rejectCertificateBatch
);

export default router;
