import express from "express";
import { addStaff, getStaff } from "../controllers/staff.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged in users (Admins/Owners) should manage staff
router.post("/", verifyToken, addStaff);
router.get("/", verifyToken, getStaff);

export default router;