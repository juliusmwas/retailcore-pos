import { prisma } from "../lib/prisma.js";

export const getBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      where: { businessId: req.user.businessId },
      include: {
        _count: {
          select: { users: true } // This counts rows in the UserBranch table for this branch
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: branches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { 
      name, code, type, status, country, city, address, 
      managerName, managerEmail, managerPhone, 
      currency, taxRegion, initialStaff, maxStaff, 
      budget, revenueTarget, openingDate 
    } = req.body;

    const locationString = address && city ? `${address}, ${city}` : null;

    const newBranch = await prisma.branch.create({
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
        initialStaff: parseInt(initialStaff) || 0,
        maxStaff: parseInt(maxStaff) || 0,
        budget: parseFloat(budget) || 0,
        revenueTarget: parseFloat(revenueTarget) || 0,
        openingDate: openingDate ? new Date(openingDate) : new Date(),
        businessId: req.user.businessId 
      }
    });

    res.status(201).json(newBranch);
  } catch (error) {
    console.error("Branch Creation Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "This Branch Code already exists." });
    }
    res.status(500).json({ message: "Server error while creating branch.", error: error.message });
  }
};