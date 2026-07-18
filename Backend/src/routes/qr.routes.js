import { Router } from "express";
import { generateCustomQR, getCustomQRs, deleteCustomQR } from "../controllers/qr.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Ensure only authenticated admins can generate custom QR codes

router.route("/generate").post(generateCustomQR);
router.route("/").get(getCustomQRs);
router.route("/:id").delete(deleteCustomQR);

export default router;
