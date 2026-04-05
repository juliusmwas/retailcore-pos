import express from "express";
import {
  getBranchSalesList,
  getSalesStats,
} from "../controllers/sales.controller.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have auth middleware

const router = express.Router();

// Get the detailed list for your Manager Table
// URL: http://localhost:5000/api/sales/list?branchId=...
router.get("/list", protect, getBranchSalesList);

// Get the stats (Volume, MPESA vs Card)
router.get("/stats", protect, getSalesStats);

export default router;
