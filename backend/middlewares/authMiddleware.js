const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      next();
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
  }
};

module.exports = { protect };
