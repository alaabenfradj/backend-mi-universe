var express = require("express");
var router = express.Router();
const ProductReview = require("../models/productReview");
const User = require("../models/user");
const Product = require("../models/product");

const { auth } = require("../lib/utils");

router.put("/add-review/:productId", auth, async (req, res) => {
  const productToBeReviewed = await Product.findOne({
    _id: req.params.productId,
  });
  const userToReviewProduct = await User.findOne({ _id: req.user._id });
  if (productToBeReviewed.seller == userToReviewProduct._id)
    return res
      .status(500)
      .json({ success: false, message: "you cant review your product" });
  if (!productToBeReviewed || !userToReviewProduct) {
    return res.status(500).json({
      success: false,
      message: "something went wrong !",
    });
  } else {
    const content = req.body.content;
    if (content) {
      let newProductReview = new ProductReview({    
        content: content,
        user: userToReviewProduct._id,
      });
      newProductReview
        .save()
        .then((rev) => {
          Product.findOneAndUpdate(
            { _id: productToBeReviewed.id },
            {
              $addToSet: { reviews: rev._id.toString() },
              $inc: { reviewsCount: 1 },
            }
          )

            .then((product) => {
              console.log(product.reviewCount);
              return res.status(201).json({
                success: true,
                review: rev,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                success: false,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        });
    } else {
      return res.status(500).json({
        success: false,
        message: "provide the content of the review",
      });
    }
  }
});
router.get("/get-prod-reviews/:idProduct", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.idProduct }).populate(
    "reviews"
  );
  if (product) {
    return res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } else {
    return res
      .status(500)
      .json({ error: "could'not find product with this id" });
  }
});

module.exports = router;
