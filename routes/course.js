const express = require("express");

const router = express.Router();

router.get("/", getAllCourses);

router.get("/:id", getLecturesByCourseId);

module.exports = router;
