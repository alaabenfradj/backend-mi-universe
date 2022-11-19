const { check}=require("express-validator");
exports.invoiceValidator=[
    check("discount", "label is required").notEmpty()
    .isBetween("discount",0,100,"discount value between 0 and 100")
    ,

    check("reference", "reference is required").notEmpty().isLength({
        max:25,
    }).withMessage("max must be  25 characters"),
    check("price", "price is required").notEmpty(),

];