import express from "express";
import {
  getReportStats,
  getManagerSummary,
} from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Use your existing auth middleware

const router = express.Router();

// The endpoint your frontend is calling
router.get("/stats", verifyToken, getReportStats);
router.get("/manager-summary", verifyToken, getManagerSummary);

export default router;
