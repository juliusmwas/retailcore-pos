import express from "express";
import { getReportStats } from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Use your existing auth middleware

const router = express.Router();

// The endpoint your frontend is calling
router.get("/stats", verifyToken, getReportStats);

export default router;
