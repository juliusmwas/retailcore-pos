import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dashboard/stats?branchId=xxxx
router.get("/stats", verifyToken, getDashboardStats);

export default router;