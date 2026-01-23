import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerOwnerService = async ({
  fullName,
  businessName,
  email,
  password
}) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const business = await prisma.business.create({
    data: {
      name: businessName,
      branches: {
        create: {
          name: "Main Branch"
        }
      }
    },
    include: { branches: true }
  });

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      businessId: business.id
    }
  });

  await prisma.userBranch.create({
    data: {
      userId: user.id,
      branchId: business.branches[0].id,
      role: "OWNER"
    }
  });

  return { message: "Business registered successfully" };
};

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { branches: true }
  });

  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, businessId: user.businessId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      branches: user.branches
    }
  };
};
