const express = require("express");
const router = express.Router();
const { register, login, logout, viewProfile } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", viewProfile);

module.exports = router;
