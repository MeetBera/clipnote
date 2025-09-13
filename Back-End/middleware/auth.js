import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // allow public endpoints
  if (req.originalUrl.startsWith("/auth")) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
