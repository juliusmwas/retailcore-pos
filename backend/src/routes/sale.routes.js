import express from "express";
import {
  getBranchSalesList,
  getSalesStats,
} from "../controllers/sales.controller.js";
// Update this line to use the actual exported name: authenticateToken
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Use 'authenticateToken' instead of 'protect'
router.get("/list", authenticateToken, getBranchSalesList);
router.get("/stats", authenticateToken, getSalesStats);

export default router;
