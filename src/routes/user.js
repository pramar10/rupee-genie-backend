const express = require("express");
const { registerUser, login, getUserData } = require("../controllers/user.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
// get
// router.get("/profile", auth, getUserData);

module.exports = router;
