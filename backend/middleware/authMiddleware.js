const { verifyToken } = require("../utils/token"); // Token utility
const userModel = require("../models/userModel");

module.exports = {
  checkUserByToken: async (req, res, next) => {
    // Get token from headers (you can store it in a cookie or Authorization header)
    const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      // Verify the token
      const decoded = verifyToken(token);
      const user = await userModel.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Token has expired!" });
      }

      // Attach the decoded user data (like user ID) to the request object
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  },
};
