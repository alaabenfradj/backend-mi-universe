var express = require("express");
var router = express.Router();

const CourseComment = require("../models/courseComment");
router.get("/", (req, res) => {
  console.log("getting course comments");
  CourseComment.find((err, admins) => {
    console.log(admins);
  });
});

module.exports = router;
