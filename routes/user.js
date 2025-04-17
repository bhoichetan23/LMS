const express = require("express");
const router = express.Router();
const { register, login, logout, viewProfile, forgotPassword, resetPassword } = require("../controllers/user");

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", viewProfile);
router.get("/forgot-password", forgotPassword);
router.get("/reset-password/:resetToken", resetPassword);

module.exports = router;
