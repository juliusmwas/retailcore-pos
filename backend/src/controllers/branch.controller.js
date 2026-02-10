import {prisma} from "../lib/prisma.js";

export const getBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: branches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    const newBranch = await prisma.branch.create({
      data: req.body
    });
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(400).json({ message: "Code must be unique or data is missing" });
  }
};