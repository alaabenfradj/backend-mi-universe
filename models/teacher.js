const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,

    },
    about: {
      type: String,
      required: true,
      maxLength: 255,
    },

    degrees: {
      type: Array,
      required: true,
    },

    specialties: {
      type: Array,
    },

    rib: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
