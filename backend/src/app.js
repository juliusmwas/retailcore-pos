import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Optional health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

export default app;
