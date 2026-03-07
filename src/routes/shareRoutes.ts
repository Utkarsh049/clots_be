import { Router, type Router as RouterType } from "express";
import { getPublicNote } from "../controllers/shareController.js";

const router: RouterType = Router();

router.get("/:shareId", getPublicNote);

export default router;
