import express from "express";
import {
  addStaff,
  getStaff,
  updateStaff,
} from "../controllers/staff.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { updateSettings } from "../controllers/staff.controller.js";

const router = express.Router();

// Only logged in users (Admins/Owners) should manage staff
router.post("/", verifyToken, addStaff);
router.put("/settings/update", verifyToken, updateSettings);
router.get("/", verifyToken, getStaff);

router.put("/:id", verifyToken, updateStaff);
router.get("/directory", verifyToken, getStaff);

export default router;
