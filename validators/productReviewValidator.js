exports.productReviewValidator=[
    check("content", "content is required")
    .notEmpty()
    .isLength({
      max: 255,
    }).withMessage("max must be 255 characters"),

    

];