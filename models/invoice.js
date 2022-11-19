const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    
    state: {
      type: Boolean,
      required: true,
      default:true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Invoice", InvoiceSchema);
