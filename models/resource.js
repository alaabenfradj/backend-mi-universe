const mongoose = require("mongoose");
const { string } = require("yup");
const Schema = mongoose.Schema;
const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      required: true,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    type: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Resource", ResourceSchema);
