import express from "express";
import { getBranches, createBranch } from "../controllers/branch.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js"; // 1. Updated name

const router = express.Router();

// 2. Apply authenticateToken to the GET route
router.get("/", authenticateToken, getBranches);

// 3. Apply authenticateToken to the POST route
router.post("/", authenticateToken, createBranch);

export default router;