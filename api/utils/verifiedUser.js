import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  console.log("Received Token:", token);  // Debugging

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verification Error:", err.message);  // Debugging
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};
