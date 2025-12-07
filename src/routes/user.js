const express = require("express");
const {
  registerUser,
  login,
  getUserData,
  refresh,
  logout,
} = require("../controllers/user.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/refresh", refresh);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/user", getUserData);
// router.get("/profile", auth, getUserData);

module.exports = router;
