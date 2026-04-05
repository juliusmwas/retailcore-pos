import express from "express";
import { getManagerSummary } from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"; // Use your existing auth middleware

const router = express.Router();

// The endpoint your frontend is calling
router.get("/manager-summary", verifyToken, getManagerSummary);

export default router;