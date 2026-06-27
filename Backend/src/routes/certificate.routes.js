import { Router } from 'express';
import { generateBulkCertificates, verifyCertificate } from '../controllers/certificate.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Public route for verification
router.route('/verify/:certificateId').get(verifyCertificate);

// Secured admin route
router.route('/generate-bulk').post(verifyJWT, upload.single('signatureImage'), generateBulkCertificates);

export default router;
