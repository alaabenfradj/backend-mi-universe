const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
// Create Schema

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    sex: {
      type: String,
      enum: ["man", "woman"],
    },

    address: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      maxLength: 8,
    },
    aboutMe: {
      type: String,
    },
    role: {
      type: [String],
      enum: ["user", "teacher", "seller", "student", "admin", "super_admin"],
      default: ["user"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Active",
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = User = mongoose.model("User", UserSchema);
