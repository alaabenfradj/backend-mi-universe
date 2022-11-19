const { check } = require("express-validator");
const User = require("../models/user");
exports.sellerValidator = [
  check("rib", "rib is required")
    .notEmpty()
    .isLength({
      min: 14,
      max: 14,
    })
    .withMessage("rib is 14 characters long"),
];
