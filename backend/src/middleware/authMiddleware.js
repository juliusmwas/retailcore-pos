import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // 1. Get the token from the Authorization header (Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // 2. If no token is provided, stop here
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 3. Verify the token using your Secret Key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user data to the request object
    // This allows your controllers to use req.user.businessId
    req.user = {
      id: decoded.id,
      businessId: decoded.businessId,
      role: decoded.role,
    };

    // 5. Move to the next function (the controller)
    next();
  } catch (err) {
    // 6. If the token is fake or expired, return an error
    console.error("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};