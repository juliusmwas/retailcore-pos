import bcrypt from "bcryptjs"; // Using bcryptjs as installed earlier
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

/**
 * REGISTER OWNER
 */
export const registerOwnerService = async ({
  fullName,
  businessName,
  email,
  password,
  phone,
  country,
  industryType,
}) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered.");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.$transaction(async (tx) => {
    // 1. Create the Business
    const business = await tx.business.create({
      data: {
        name: businessName,
        phone: phone,
        country: country,
        industry: industryType,
      },
    });

    // 2. Create the Owner User
    const user = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone: phone,
        businessId: business.id,
        // Owners get a special staff number automatically
        staffNumber: `OWNER-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "ACTIVE"
      },
    });

    const token = jwt.sign(
      { userId: user.id, businessId: business.id, role: "OWNER" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user: { ...user, role: "OWNER" }, business };
  });
};

export const loginService = async ({ identifier, password }) => {
  // 1. Detect if the user typed an email or a staff number
  // Added a safety check here to ensure identifier exists
  const isEmail = identifier?.includes("@"); 
  const queryField = isEmail ? { email: identifier } : { staffNumber: identifier };

  // 2. Find User
  const user = await prisma.user.findUnique({
    where: queryField,
    include: {
      business: true,
      branches: {
        include: { branch: true },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("This account has been deactivated.");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // 🛡️ ROBUST ROLE DETECTION
  // We check if the staffNumber starts with "OWNER" or if they are the primary account holder
  const isOwner = user.staffNumber?.startsWith("OWNER") || user.role === "OWNER";
  const userRole = isOwner ? "OWNER" : (user.branches[0]?.role || "CASHIER");

  // 5. Generate Token
  const token = jwt.sign(
    {
      userId: user.id,
      businessId: user.businessId,
      role: userRole
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      staffNumber: user.staffNumber,
      businessId: user.businessId,
      // Added safety for business name
      businessName: user.business?.name || "My Business", 
      role: userRole
    },
    // Added safety for branches map
    branches: user.branches?.map(ub => ub.branch) || []
  };
};