const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuperAdminSchema = new Schema(
  {
    login: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperAdmin", SuperAdminSchema);
