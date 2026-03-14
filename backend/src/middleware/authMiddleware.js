import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // 1. Check if header exists
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 2. Smart Token Extraction
  // This handles both "Bearer <token>" and just "<token>"
  let token = authHeader;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 3. Clean the token string
  // Removes any accidental quotes or whitespace that might come from localStorage
  token = token.trim().replace(/^"(.*)"$/, '$1');

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user data to the request object
    req.user = {
      id: decoded.userId || decoded.id,
      businessId: decoded.businessId,
      role: decoded.role,
    };
    
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    
    // Specifically catch malformed errors to give better feedback
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Session invalid or malformed" });
    }
    
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Keep this to support older route files using the verifyToken name
export const verifyToken = authenticateToken;