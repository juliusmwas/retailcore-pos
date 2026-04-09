import express from "express";
import {
  getBranchSalesList,
  getSalesStats,
  createSale, // Add this import
} from "../controllers/sales.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing routes
router.get("/list", authenticateToken, getBranchSalesList);
router.get("/stats", authenticateToken, getSalesStats);

// NEW: This route will handle the POST request from your POS.jsx
router.post("/", authenticateToken, createSale);

export default router;
