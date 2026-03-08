import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import logger from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/upload", uploadRoutes);
app.use("/share", shareRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "clots-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Clots API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
