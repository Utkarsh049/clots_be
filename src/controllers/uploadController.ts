import type { Request, Response } from "express";
import { uploadToS3 } from "../services/s3Service.js";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadToS3(req.file);

    res.json({
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};