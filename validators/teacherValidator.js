const { check } = require("express-validator");
const User = require("../models/user");
exports.teacherValidator = [
    check("about", "about is required")
        .notEmpty()
        .isLength({
            min: 30,
            max: 255,
        })
        .withMessage("about must be between 30 characters and 255 characters"),
    check("degrees", "degrees are required")
        .notEmpty(),
    check("rib", "rib is required").notEmpty(),
];
