import type { Request, Response } from "express";
import * as noteService from "../services/noteService.js";

export const getPublicNote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { shareId } = req.params;

    const note = await noteService.getPublicNote(shareId as string);

    if (!note) {
      // Return 404 cleanly so public routes don't leak authorization assumptions
      res.status(404).json({ error: "Public note not found." });
      return;
    }

    res.status(200).json({
      title: note.title,
      content: note.content,
      imageUrl: note.imageUrl,
      createdAt: note.createdAt,
      tags: note.tags,
    });
  } catch (error) {
    console.error("Get public note error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
