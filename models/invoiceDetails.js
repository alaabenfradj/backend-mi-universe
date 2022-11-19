const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvoiceDetailsSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  
  invoice: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

module.exports = mongoose.model("InvoiceDetails", InvoiceDetailsSchema);
