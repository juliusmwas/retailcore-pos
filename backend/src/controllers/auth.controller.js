import { registerOwnerService, loginService } from "../services/auth.service.js";

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
    // identifier will be either the email or the staffNumber from the frontend
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};