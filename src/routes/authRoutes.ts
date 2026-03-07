import { Router, type Router as RouterType } from "express";
import { signup, login } from "../controllers/authController.js";

const router: RouterType = Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
