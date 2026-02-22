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

/**
 * LOGIN (Supports Email OR Staff Number)
 */
export const loginService = async ({ identifier, password }) => {
  // 1. Detect if the user typed an email or a staff number
  const isEmail = identifier.includes("@");
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

  // 3. Check if account is active
  if (user.status !== "ACTIVE") {
    throw new Error("This account has been deactivated.");
  }

  // 4. Verify Password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  // 5. Generate Token
  const token = jwt.sign(
    {
      userId: user.id,
      businessId: user.businessId,
      // If it's the owner email, set role OWNER, else take role from branch
      role: user.email === user.business.email ? "OWNER" : (user.branches[0]?.role || "CASHIER")
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
      businessName: user.business.name,
      role: user.email === user.business.email ? "OWNER" : (user.branches[0]?.role || "CASHIER")
    },
    branches: user.branches.map(ub => ub.branch)
  };
};