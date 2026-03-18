// backend/src/routes/branch.routes.js
import express from "express";
import { 
  getBranches, 
  createBranch, 
  getBranchById 
} from "../controllers/branch.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { updateBranch } from "../controllers/branch.controller.js";

const router = express.Router();

/**
 * OPTION 1: Apply middleware to individual routes (Your current style)
 */
router.get("/", authenticateToken, getBranches);
router.post("/", authenticateToken, createBranch);
router.get("/:id", authenticateToken, getBranchById); // Added authenticateToken here
router.patch("/:id", authenticateToken, updateBranch);

/**
 * OPTION 2: Apply to all routes in this file (Cleaner)
 * If every route in this file requires a login, you can just do:
 * * router.use(authenticateToken);
 * router.get("/", getBranches);
 * router.post("/", createBranch);
 * router.get("/:id", getBranchById);
 */

export default router;