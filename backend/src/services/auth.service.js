import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";



/*** REGISTER OWNER (Create Business + Main Branch + Owner User)*/

export const registerOwnerService = async ({
  fullName,
  businessName,
  email,
  password,
  phone,        // New: Contact for support/2FA
  country,      // New: Sets Currency/Tax defaults
  industryType, // New: Customizes system features
}) => {
  // 1. Safety Check
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("This email is already registered to a business.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Atomic Transaction: Create everything or nothing
  // This prevents "orphaned" users if the business creation fails
  return await prisma.$transaction(async (tx) => {
    
    // Create the Business Entity
    const business = await tx.business.create({
      data: {
        name: businessName,
        phone: phone,
        country: country,
        industry: industryType,
        // Automatically create the first branch within the business
        branches: {
          create: {
            name: "Main Branch",
            code: "MAIN-001",
            status: "ACTIVE",
            country: country,
            managerName: fullName,
          },
        },
      },
      include: { branches: true },
    });

    // Create the Primary Admin User
    const user = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone: phone,
        businessId: business.id,
      },
    });

    // Link User to the Main Branch with OWNER permissions
    await tx.userBranch.create({
      data: {
        userId: user.id,
        branchId: business.branches[0].id,
        role: "OWNER",
      },
    });

    // Generate JWT for immediate login
    const token = jwt.sign(
      { 
        userId: user.id, 
        businessId: business.id 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        businessId: user.businessId,
        role: "OWNER"
      },
      business: {
        id: business.id,
        name: business.name
      },
      message: "Business and Admin account created successfully",
    };
  });
};

/** * LOGIN */
export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      branches: {
        include: { branch: true },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      businessId: user.businessId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      businessId: user.businessId,
      branches: user.branches,
    },
  };
};
