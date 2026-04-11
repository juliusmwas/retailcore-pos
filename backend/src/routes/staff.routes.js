// staff.routes.js
import express from "express";
import {
  addStaff,
  getStaff,
  updateStaff,
  updateStaffProfile,
  updateSettings,
} from "../controllers/staff.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Static Routes (Specific paths)
router.post("/", verifyToken, addStaff);
router.get("/", verifyToken, getStaff);
router.get("/directory", verifyToken, getStaff);
router.put("/settings/update", verifyToken, updateSettings);

// MOVE THIS UP - It must be above the /:id route
router.put("/profile/update", verifyToken, updateStaffProfile);

// 2. Dynamic Routes (Parameterized paths)
// This catches anything that didn't match the specific paths above
router.put("/:id", verifyToken, updateStaff);

export default router;
