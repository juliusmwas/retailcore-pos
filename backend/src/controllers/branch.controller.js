import { prisma } from "../lib/prisma.js";

export const getBranches = async (req, res) => {
  try {
    // Only fetch branches belonging to THIS business
    const branches = await prisma.branch.findMany({
      where: { businessId: req.user.businessId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: branches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    // Ensure we attach the businessId from the authenticated user's token
    const newBranch = await prisma.branch.create({
      data: {
        ...req.body,
        businessId: req.user.businessId // THIS IS CRITICAL
      }
    });
    res.status(201).json(newBranch);
  } catch (error) {
    console.error("Creation Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "The Branch Code already exists." });
    }
    res.status(400).json({ message: error.message || "Failed to create branch." });
  }
};