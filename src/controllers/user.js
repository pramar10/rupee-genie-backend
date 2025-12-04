const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateTokens = (user) => {
  // token
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  return accessToken;
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
      success: true,
      message: "Registration successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// login through password
exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const accessToken = generateTokens(user);
    res.status(200).json({
      success: true,
      message: "Success",
      data: {
        user: user,
        token: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.refresh = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken)
//     return res.status(401).json({ message: "Refresh token required" });
//   const user = await User.findOne({ refreshToken });
//   if (!user) return res.status(401).json({ message: "Invalid refresh token " });
//   try {
//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };
// logout
// exports.logout = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
//     res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// get Profile
// exports.getUserData = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     return res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.sendOtp = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     const expiry = Date.now() + 5 * 60 * 1000;
//     let user = await User.findOne({ phone });
//     //  for mobile otp
//     if (!user) {
//       return res.status(400).json({ message: "User already doesn't exists" });
//     } else {
//       user.otp = otp;
//       user.otpExpiry = expiry;
//       await user.save();
//     }
//     res.json({
//       success: true,
//       message: "OTP sent",
//       otp, // remove in production
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body;
//     const user = await User.findOne({ phone });
//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     if (user.otp !== otp || Date.now() > user.otpExpiry)
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired OTP" });
//     const { accessToken, refreshToken } = generateTokens(user);
//     // success full
//     user.otp = null;
//     user.otpExpiry = null;
//     user.refreshToken = refreshToken;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "OTP verified",
//       data: {
//         user: user,
//         token: accessToken,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const generateTokens = (user) => {
//   // token
//   const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "15min",
//   });
//   // refresh token
//   const refreshToken = jwt.sign(
//     { id: user._id },
//     process.env.JWT_REFRESH_SECRET,
//     { expiresIn: "7d" }
//   );
//   return { accessToken, refreshToken };
// };
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, phone, password,email } = req.body;
//     const exist = await User.findOne({ phone });
//     if (exist) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       phone,
//       email,
//       password: hashPassword,
//     });
//     res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // login through password
// exports.login = async (req, res) => {
//   try {
//     const { phone, password } = req.body;
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Incorrect password" });

//     const { accessToken, refreshToken } = generateTokens(user);
//     user.refreshToken = refreshToken; // store in DB
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Success",
//       data: {
//         user: user,
//         token: accessToken,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// exports.refresh = async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken)
//     return res.status(401).json({ message: "Refresh token required" });
//   const user = await User.findOne({ refreshToken });
//   if (!user) return res.status(401).json({ message: "Invalid refresh token " });
//   try {
//     jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "15m",
//     });

//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };
// // logout
// exports.logout = async (req, res) => {
//   try {
//     const { refreshToken } = req.body;
//     await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
//     res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// // get Profile
// exports.getUserData = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     return res.status(200).json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
