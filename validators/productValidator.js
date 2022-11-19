const {validationResult, check}=require("express-validator");

exports.productValidator=[
    check("label", "label is required")
    .notEmpty()
    .isLength({
      min: 4,
      max: 15,
    }).withMessage("label must be between 4 characters and 15 characters"),

    check("reference", "reference is required").notEmpty().isLength({
        max:25,
    }).withMessage("max must be  25 characters"),
    check("price", "price is required").notEmpty(),

];