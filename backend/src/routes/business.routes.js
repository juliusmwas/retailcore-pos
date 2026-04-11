import express from "express";
import { updateBusinessSettings } from "../controllers/business.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// This matches the URL we used in the frontend
router.put("/settings", authenticateToken, updateBusinessSettings);

export default router;
