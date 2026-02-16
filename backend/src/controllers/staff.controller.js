import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const addStaff = async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;
    const { businessId } = req.user;

    // 🛡️ Rule 1: Check for existing user (No duplicates)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    // 🛡️ Rule 2: Enforce branch assignment for non-owners
    if (role !== "OWNER" && !branchId) {
      return res.status(400).json({ message: "Staff must be assigned to a specific branch." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STAFF",
        businessId,
        branchId: branchId || null, // Owners might be global, staff are localized
      },
    });

    // Remove password from response for security
    const { password: _, ...staffData } = newStaff;
    res.status(201).json({ message: "Staff onboarded successfully", data: staffData });
  } catch (error) {
    console.error("Staff Creation Error:", error);
    res.status(500).json({ message: "Failed to onboard staff. Please try again." });
  }
};

export const getStaff = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    const whereClause = { businessId };
    
    // 🛡️ Rule 3: Filter by branch if requested
    if (branchId && branchId !== "ALL") {
      whereClause.branchId = branchId;
    }

    const staff = await prisma.user.findMany({
      where: whereClause,
      include: {
        branch: { select: { name: true } } // Only pull the branch name
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff directory." });
  }
};