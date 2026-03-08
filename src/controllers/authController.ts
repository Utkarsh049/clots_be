import type { Request, Response } from "express";
import * as authService from "../services/authService.js";
import { signupSchema, loginSchema } from "../validation/authValidation.js";
import logger from "../utils/logger.js";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedParams = signupSchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json({
        error: "Validation error",
        details: parsedParams.error.format(),
      });
      return;
    }

    const { name, email, password } = parsedParams.data;

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Email already in use." });
      return;
    }

    const hashedPassword = await authService.hashPassword(password);
    const user = await authService.createUser(name, email, hashedPassword);
    const token = authService.generateToken(user.id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error(error, "Signup failed");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedParams = loginSchema.safeParse(req.body);

    if (!parsedParams.success) {
      res.status(400).json({
        error: "Validation error",
        details: parsedParams.error.format(),
      });
      return;
    }

    const { email, password } = parsedParams.data;

    const user = await authService.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const isMatch = await authService.comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = authService.generateToken(user.id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error(error, "Login failed");
    res.status(500).json({ error: "Internal server error" });
  }
};
