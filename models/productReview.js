const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductReview = new Schema(
  {
    content: {
      type: String,
      maxLength: 255,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ProductReview", ProductReview);
