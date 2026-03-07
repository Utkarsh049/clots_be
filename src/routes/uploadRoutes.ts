import { Router, type Router as RouterType } from "express";
import {
  uploadImage,
  uploadMiddleware,
} from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

// Protect the route using authentication middleware
router.post(
  "/",
  verifyToken,
  (req, res, next) => {
    // Wrap multer middleware to catch synchronous validation errors (like file type/size limits)
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadImage,
);

export default router;
