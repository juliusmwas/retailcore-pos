import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";



/*** REGISTER OWNER (Create Business + Main Branch + Owner User)*/

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
    // 1. Create ONLY the Business (No branches yet)
    const business = await tx.business.create({
      data: {
        name: businessName,
        phone: phone,
        country: country,
        industry: industryType,
      },
    });

    // 2. Create the User
    const user = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone: phone,
        businessId: business.id,
      },
    });

    // Note: We don't create UserBranch here because no branches exist yet!

    const token = jwt.sign(
      { userId: user.id, businessId: business.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user, business };
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
