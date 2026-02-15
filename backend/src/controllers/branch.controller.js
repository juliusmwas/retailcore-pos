import { prisma } from "../lib/prisma.js";

export const getBranches = async (req, res) => {
  try {
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
    // 1. Destructure ONLY the fields that exist in your schema.prisma
    const { 
      name, code, type, status, country, city, address, 
      managerName, managerEmail, managerPhone, 
      currency, taxRegion, initialStaff, maxStaff, 
      budget, revenueTarget, openingDate 
    } = req.body;

    // 2. Map address/city to the 'location' field if needed
    const locationString = address && city ? `${address}, ${city}` : null;

    // 3. Create the branch using ONLY validated fields
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
        currency,
        taxRegion,
        // Ensure numbers are actual numbers
        initialStaff: parseInt(initialStaff) || 0,
        maxStaff: parseInt(maxStaff) || 0,
        budget: parseFloat(budget) || 0,
        revenueTarget: parseFloat(revenueTarget) || 0,
        openingDate: openingDate ? new Date(openingDate) : new Date(),
        // Critical: Link to the business
        businessId: req.user.businessId 
      }
    });

    res.status(201).json(newBranch);
  } catch (error) {
    console.error("Prisma Specific Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "This Branch Code already exists." });
    }
    res.status(400).json({ message: "Database rejected the request. Fields mismatch." });
  }
};