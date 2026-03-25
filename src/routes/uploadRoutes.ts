import { Router, type Router as RouterType } from "express";
import {
  uploadImage,
} from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router: RouterType = Router();

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  uploadImage
);
export default router;
  