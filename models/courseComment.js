const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseCommentSchema = new Schema(
  {
    content: {
      type: String,
      maxLength: 255,
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("CourseComment", CourseCommentSchema);
