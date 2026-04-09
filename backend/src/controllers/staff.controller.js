import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const addStaff = async (req, res) => {
  try {
    // 1. Destructure fields - ensure these match your frontend formData
    const { fullName, email, password, role, branchId, staffNumber, phone } =
      req.body;
    const { businessId } = req.user;

    // 2. Check for existing Email or Staff Number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { staffNumber }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "A user with this email already exists."
            : "This Staff Number is already assigned.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Use a Transaction to create User and their Branch assignment together
    const result = await prisma.$transaction(async (tx) => {
      // Create the core User record
      const newUser = await tx.user.create({
        data: {
          fullName, // Matches schema
          email,
          staffNumber, // Matches schema
          phone,
          password: hashedPassword,
          businessId,
          status: "ACTIVE",
        },
      });

      // Create the UserBranch link (This is where Role and Branch live now)
      await tx.userBranch.create({
        data: {
          userId: newUser.id,
          branchId: branchId,
          role: role || "CASHIER",
        },
      });

      return newUser;
    });

    const { password: _, ...staffData } = result;
    res
      .status(201)
      .json({ message: "Staff onboarded successfully", data: staffData });
  } catch (error) {
    console.error("Staff Creation Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during onboarding." });
  }
};

export const getStaff = async (req, res) => {
  try {
    const { branchId } = req.query;
    const { businessId } = req.user;

    // 1. Define the time boundaries for "Today" (Midnight to now)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 2. Fetch from User table with the sales relation
    const staff = await prisma.user.findMany({
      where: {
        businessId: businessId,
        ...(branchId && branchId !== "ALL"
          ? {
              branches: {
                some: { branchId: branchId },
              },
            }
          : {}),
      },
      include: {
        branches: {
          include: {
            branch: { select: { name: true } },
          },
        },
        // This connects to the "sales Sale[]" relation in your User model
        sales: {
          where: {
            createdAt: {
              gte: startOfToday,
              lte: endOfToday,
            },
            status: "COMPLETED", // Only count successful sales
          },
          select: {
            totalAmount: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
    });

    // 3. Flatten the data and sum the totals for the frontend
    const formattedStaff = staff.map((member) => {
      const assignedBranchName = member.branches?.[0]?.branch?.name;

      // Sum up the totalAmount from today's sales array
      const dailyTotal = member.sales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0,
      );

      return {
        ...member,
        // Pull the role from the UserBranch junction table
        role: member.branches?.[0]?.role || "CASHIER",
        // This matches the variable name in your Frontend Grid!
        salesToday: dailyTotal,
        branchName:
          assignedBranchName ||
          (member.staffNumber ? "Unassigned" : "Global/Head Office"),
      };
    });

    res.json({ data: formattedStaff });
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    res.status(500).json({ message: "Error fetching staff directory." });
  }
};

// Change 'updateUser' to 'updateStaff' to match your routes file!
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. Destructure all fields being sent from your Edit Modal
    const { fullName, email, role, status, branchId } = req.body;
    const { businessId } = req.user; // Security check

    // 2. Use a transaction to update both the User and their Role/Branch link
    const updatedStaff = await prisma.$transaction(async (tx) => {
      // Update core user info
      const user = await tx.user.update({
        where: {
          id: id,
          businessId: businessId, // Ensures you can't edit users from other businesses
        },
        data: {
          fullName,
          email,
          status,
        },
      });

      // Update the Role/Branch in the junction table if provided
      if (role || branchId) {
        await tx.userBranch.updateMany({
          where: { userId: id },
          data: {
            ...(role && { role }),
            ...(branchId && { branchId }),
          },
        });
      }

      return user;
    });

    // 3. Return the updated user (Frontend expects this to update the list)
    res.status(200).json({
      success: true,
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Update Staff Error:", error);
    res.status(500).json({
      message: "Failed to update staff member",
      error: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      currentPassword,
      newPassword,
      branchPhone,
      receiptFooter,
    } = req.body;

    const userUpdateData = {};

    // 1. Logic for User Profile (Name & Password)
    if (fullName) userUpdateData.fullName = fullName;

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required to change password" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password incorrect" });
      }

      userUpdateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update User Table
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    // 2. Logic for Branch Configuration
    // We fetch the branch associated with this user
    if (branchPhone || receiptFooter) {
      // 1. Find the branch via the UserBranch join table
      const userBranchRelation = await prisma.userBranch.findFirst({
        where: { userId: userId },
        select: { branchId: true },
      });

      if (userBranchRelation?.branchId) {
        // 2. Update the Branch table using the new fields we just added to the schema
        await prisma.branch.update({
          where: { id: userBranchRelation.branchId },
          data: {
            phone: branchPhone || undefined,
            receiptFooter: receiptFooter || undefined,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Settings and Branch details updated successfully",
      data: {
        fullName: updatedUser.fullName,
        // Send back any updated branch info if needed
      },
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error updating settings" });
  }
};
