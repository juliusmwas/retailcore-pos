import express from "express";
import {
  getBranchInventory,
  adjustStock,
  createRestockRequest,
} from "../controllers/inventory.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Full path will be: /api/inventory/branch
router.get("/branch", authenticateToken, getBranchInventory);
// Add this line with your other routes
router.patch("/adjust", authenticateToken, adjustStock);
router.post("/restock-request", authenticateToken, createRestockRequest);

export default router;
