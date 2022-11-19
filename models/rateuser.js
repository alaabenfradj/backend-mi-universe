const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RateuserSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        
    },
    rate:{
        type: Number,
        
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Rateuser", RateuserSchema);