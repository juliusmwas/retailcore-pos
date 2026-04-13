import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs"; // Ensure you have bcryptjs installed

export const getBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      where: { businessId: req.user.businessId },
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: branches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    const {
      name,
      code,
      type,
      status,
      country,
      city,
      address,
      managerName,
      managerEmail,
      managerPhone,
      password, // Added password from frontend
      currency,
      taxRegion,
      initialStaff,
      maxStaff,
      budget,
      revenueTarget,
      openingDate,
    } = req.body;

    const businessId = req.user.businessId;

    // 1. Check if manager email already exists as a user
    const existingUser = await prisma.user.findUnique({
      where: { email: managerEmail },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this manager email already exists." });
    }

    const locationString = address && city ? `${address}, ${city}` : null;

    // 2. Start a Transaction to create both Branch and Manager User
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Branch
      const newBranch = await tx.branch.create({
        data: {
          name,
          code,
          type,
          status: status || "ACTIVE",
          country,
          city,
          address,
          location: locationString,
          managerName,
          managerEmail,
          managerPhone,
          currency: currency || "KES",
          taxRegion,
          initialStaff: 1,
          maxStaff: parseInt(maxStaff) || 20,
          budget: parseFloat(budget) || 0,
          revenueTarget: parseFloat(revenueTarget) || 0,
          openingDate: openingDate ? new Date(openingDate) : new Date(),
          businessId,
        },
      });

      // 2. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Create the User (REMOVE 'role: "MANAGER"' FROM HERE)
      const newUser = await tx.user.create({
        data: {
          fullName: managerName,
          email: managerEmail,
          phone: managerPhone,
          password: hashedPassword,
          businessId,
          status: "ACTIVE",
        },
      });

      // 4. Link User to Branch (THIS IS WHERE THE ROLE LIVES)
      await tx.userBranch.create({
        data: {
          userId: newUser.id,
          branchId: newBranch.id,
          role: "MANAGER", // This matches your Enum in the schema
        },
      });

      return newBranch;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Branch Creation Error:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "This Branch Code already exists." });
    }
    res.status(500).json({
      message: "Server error while creating branch.",
      error: error.message,
    });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;

    // 1. Get today's start time for sales calculation
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const branch = await prisma.branch.findFirst({
      where: {
        id: id,
        businessId: businessId,
      },
      include: {
        users: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                status: true,
                lastLogin: true,
              },
            },
          },
        },
        inventory: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
                sellingPrice: true,
                category: { select: { name: true } },
              },
            },
          },
        },
        // 2. Fetch sales for today to calculate the total
        sales: {
          where: {
            createdAt: { gte: startOfToday },
            status: "COMPLETED", // Only count successful sales
          },
          select: {
            totalAmount: true,
          },
        },
        _count: {
          select: {
            users: true,
            inventory: true,
          },
        },
      },
    });

    if (!branch) {
      return res.status(404).json({
        status: "error",
        message: "Branch not found or unauthorized.",
      });
    }

    // 3. Calculate today's sales total on the fly
    const todaySales = branch.sales.reduce(
      (acc, sale) => acc + (sale.totalAmount || 0),
      0,
    );

    res.json({
      status: "success",
      data: {
        ...branch,
        todaySales, // We inject this so the frontend can just call branch.todaySales
      },
    });
  } catch (error) {
    console.error("Fetch branch error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching branch.",
    });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.user;
    const updateData = req.body;

    // Remove fields that should not be updated manually via this form
    delete updateData.id;
    delete updateData.businessId;
    delete updateData.createdAt;

    const updatedBranch = await prisma.branch.update({
      where: {
        id: id,
        businessId: businessId, // Security: Ensure they own the branch
      },
      data: updateData,
    });

    res.json({
      status: "success",
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    console.error("Update branch error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to update branch" });
  }
};
