import { Router } from "express";
import {
  registerOwner,
  loginUser,
  updatePassword,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerOwner);
router.post("/login", loginUser);
router.put("/update-password", authenticateToken, updatePassword);

export default router;
