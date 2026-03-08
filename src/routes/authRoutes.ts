import { Router, type Router as RouterType } from "express";
import { signup, login, getProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router: RouterType = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);

export default router;
