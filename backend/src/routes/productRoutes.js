// backend/src/routes/productRoutes.js
import express from "express";

import {
  createProduct,
  getAllProducts,
  bulkDeleteProducts,
  updateProduct,
  searchProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// PROTECT ALL ROUTES:
// You can also add router.use(authenticateToken) here to apply it to everything below
router.get("/", authenticateToken, getAllProducts);

// FIX: Added authenticateToken here so the controller can find your businessId
router.get("/search", authenticateToken, searchProduct);

router.post("/", authenticateToken, createProduct);
router.delete("/bulk-delete", authenticateToken, bulkDeleteProducts);
router.put("/:id", authenticateToken, updateProduct);

export default router;
