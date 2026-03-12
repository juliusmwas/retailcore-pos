import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Get the token from the Authorization header (Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // 2. If no token is provided, stop here
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

 // backend/src/middleware/authMiddleware.js
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = {
    id: decoded.userId, // ✅ Changed 'decoded.id' to 'decoded.userId'
    businessId: decoded.businessId,
    role: decoded.role,
  };

  next();
} catch (err) {
  console.error("Token verification failed:", err.message);
  res.status(401).json({ message: "Token is not valid" });
}
};