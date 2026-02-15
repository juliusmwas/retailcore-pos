import express from "express";
import { getBranches, createBranch } from "../controllers/branch.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // 1. Import the guard

const router = express.Router();

// 2. Apply verifyToken to the GET route
// This ensures 'req.user' exists when getBranches runs
router.get("/", verifyToken, getBranches);

// 3. Apply verifyToken to the POST route
// This ensures 'req.user' exists when createBranch tries to read 'businessId'
router.post("/", verifyToken, createBranch);

export default router;