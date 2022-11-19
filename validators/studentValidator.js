const { check } = require("express-validator");
const User = require("../models/user");
exports.studentValidator = [
  check("rib", "rib is required")
    .notEmpty()
    .isLength({
      min: 14,
      max: 14,
    })
    .withMessage("rib is 14 characters long"),
  check("interestedIn", "you need to mention some of your interests !"),
];
