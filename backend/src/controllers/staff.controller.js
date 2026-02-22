import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const addStaff = async (req, res) => {
  try {
    // 1. Destructure fields - ensure these match your frontend formData
    const { fullName, email, password, role, branchId, staffNumber, phone } = req.body;
    const { businessId } = req.user;

    // 2. Check for existing Email or Staff Number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { staffNumber }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? "A user with this email already exists." 
          : "This Staff Number is already assigned." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Use a Transaction to create User and their Branch assignment together
    const result = await prisma.$transaction(async (tx) => {
      // Create the core User record
      const newUser = await tx.user.create({
        data: {
          fullName,      // Matches schema
          email,
          staffNumber,   // Matches schema
          phone,
          password: hashedPassword,
          businessId,
          status: "ACTIVE"
        },
      });

      // Create the UserBranch link (This is where Role and Branch live now)
      await tx.userBranch.create({
        data: {
          userId: newUser.id,
          branchId: branchId,
          role: role || "CASHIER"
        }
      });

      return newUser;
    });

    const { password: _, ...staffData } = result;
    res.status(201).json({ message: "Staff onboarded successfully", data: staffData });
  } catch (error) {
    console.error("Staff Creation Error:", error);
    res.status(500).json({ message: "Internal server error during onboarding." });
  }
};

export const getStaff = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    // 1. Fetch from User table so we don't miss Admins/Owners
    const staff = await prisma.user.findMany({
      where: {
        businessId: businessId,
        // Filter by branch if branchId is provided and not "ALL"
        ...(branchId && branchId !== "ALL" ? {
          branches: {
            some: { branchId: branchId }
          }
        } : {})
      },
      include: {
        branches: {
          include: {
            branch: { select: { name: true } }
          }
        }
      },
      orderBy: { fullName: 'asc' }
    });

    // 2. Flatten the data so the frontend gets a clean object
    const formattedStaff = staff.map(member => {
      // Get the first branch name if they are assigned to one
      const assignedBranchName = member.branches?.[0]?.branch?.name;
      
      return {
        ...member,
        // We use the role from the User model, or fallback to the junction table role
        role: member.branches?.[0]?.role || "ADMIN", 
        branchName: assignedBranchName || (member.staffNumber ? "Unassigned" : "Global/Head Office")
      };
    });

    res.json({ data: formattedStaff });
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    res.status(500).json({ message: "Error fetching staff directory." });
  }
};