import express from "express";
import { getBranches, createBranch } from "../controllers/branch.controller.js";

const router = express.Router();

router.get("/", getBranches);
router.post("/", createBranch);

export default router;