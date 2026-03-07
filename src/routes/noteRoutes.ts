import { Router, type Router as RouterType } from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesByTag,
  toggleShare,
} from "../controllers/noteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

// Protect all note routes requiring authentication
router.use(verifyToken);

router.post("/", createNote);
router.get("/search", searchNotes);
router.get("/tag/:slug", getNotesByTag);
router.get("/", getNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/share", toggleShare);
router.delete("/:id/share", toggleShare);

export default router;
