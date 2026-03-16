import { registerOwnerService, loginService } from "../services/auth.service.js";
import { prisma } from "../lib/prisma.js"; // Ensure this path matches your project

export const registerOwner = async (req, res) => {
  try {
    const result = await registerOwnerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    // 1. Destructure email and password from the frontend request
    const { email, password } = req.body;

    // 2. Map 'email' to 'identifier' so the authService can process it
    const result = await loginService({ 
      identifier: email, 
      password 
    });

    // ✨ 3. UPDATE LAST LOGIN
    // result.user.id assumes your loginService returns { user: { id, ... }, token }
    if (result.user && result.user.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { lastLogin: new Date() }
      });
    }

    res.status(200).json(result);
  } catch (err) {
    // This will now catch the "Invalid credentials" or other errors properly
    res.status(401).json({ message: err.message });
  }
};