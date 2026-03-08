import type { Request, Response } from "express";
import * as noteService from "../services/noteService.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../validation/noteValidation.js";
import logger from "../utils/logger.js";

export const createNote = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate the request body with Zod
    const parsedParams = createNoteSchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json({
        error: "Validation error",
        details: parsedParams.error.format(),
      });
      return;
    }

    const { title, content, imageUrl, tags } = parsedParams.data;

    const note = await noteService.createNote({
      title,
      content,
      imageUrl: imageUrl ?? undefined,
      tags: tags ?? undefined,
      userId,
    });

    res.status(201).json(note);
  } catch (error) {
    logger.error(error, "Create note error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);

    const result = await noteService.getNotesByUserPaginated(
      userId,
      isNaN(page) || page < 1 ? 1 : page,
      isNaN(limit) || limit < 1 ? 10 : limit,
    );
    res.status(200).json(result);
  } catch (error) {
    logger.error(error, "Get notes error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNote = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const note = await noteService.getNoteById(id as string, userId);

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    logger.error(error, "Get note error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateNote = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Validate request body
    const parsedParams = updateNoteSchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json({
        error: "Validation error",
        details: parsedParams.error.format(),
      });
      return;
    }

    const { title, content, imageUrl, tags } = parsedParams.data;

    const note = await noteService.updateNote(id as string, userId, {
      title: title ?? undefined,
      content: content ?? undefined,
      imageUrl: imageUrl ?? undefined,
      tags: tags ?? undefined,
    });

    if (!note) {
      res
        .status(404)
        .json({ error: "Note not found or unauthorized to update" });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    logger.error(error, "Update note error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNote = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const note = await noteService.deleteNote(id as string, userId);

    if (!note) {
      res
        .status(404)
        .json({ error: "Note not found or unauthorized to delete" });
      return;
    }

    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    logger.error(error, "Delete note error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchNotes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const query = req.query.q as string;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!query) {
      res.status(400).json({ error: "Search query 'q' is required." });
      return;
    }

    const notes = await noteService.searchNotes(userId, query);
    res.status(200).json(notes);
  } catch (error) {
    logger.error(error, "Search notes error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotesByTag = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { slug } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const notes = await noteService.getNotesByTag(userId, slug as string);
    res.status(200).json(notes);
  } catch (error) {
    logger.error(error, "Get notes by tag error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleShare = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Determine the state based on the HTTP method
    const isPublic = req.method === "POST";

    const note = await noteService.toggleNoteShare(
      id as string,
      userId,
      isPublic,
    );

    if (!note) {
      res
        .status(404)
        .json({ error: "Note not found or unauthorized to update share stat" });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    logger.error(error, "Toggle share error");
    res.status(500).json({ error: "Internal server error" });
  }
};
