const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if user still has a refresh token (i.e., not logged out)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Session expired. Login again." });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
