const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReclamationSchema = new Schema(
  {
    content: {
      type: String,
      maxLength: 255,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Reclamation", ReclamationSchema);
