const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookMarkSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});
module.exports = mongoose.model("bookmark", BookMarkSchema);
