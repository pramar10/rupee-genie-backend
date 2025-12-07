const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateTokens = (user) => {
  // token
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15min",
  });
  // refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;
    const exist = await User.findOne({ phone });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      email,
      password: hashPassword,
    });
    res.status(201).json({
      status: "201",
      message: "Registration successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// login through password
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken; // store in DB
    await user.save();
    res.status(200).json({
      status: "200",
      user,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });
  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(401).json({ message: "Invalid refresh token " });
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ status: "200", accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
// logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    res.json({ status: "200", message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// getUser
exports.getUserData = async (req, res) => {
  const id = req.body._id;
  try {
    const user = await User.findById(id);
    return res.status(200).json({ status: "200", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
