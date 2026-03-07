import type { Response } from "express";
import multer from "multer";
import { uploadImageToS3 } from "../services/uploadService.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

// Multer Memory Storage Configuration
const storage = multer.memoryStorage();

// File limits and filtering
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."));
    }
  },
});

import type { RequestHandler } from "express";

// Middleware array to export for routing
export const uploadMiddleware: RequestHandler = upload.single("image");

// Controller operation
export const uploadImage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided." });
      return;
    }

    const { buffer, originalname, mimetype } = req.file;

    const imageUrl = await uploadImageToS3(buffer, originalname, mimetype);

    res.status(200).json({ url: imageUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Internal server error during upload.",
      details: error.message,
    });
  }
};
