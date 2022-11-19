var express = require("express");
var router = express.Router();
const Course = require("../models/course");
const Chapter = require("../models/chapter");
const { auth } = require("../lib/utils");
const Teacher = require("../models/teacher");

//get chapters by course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    if (!course) {
      res.status(500).json({
        success: false,
        message: "could not find course",
      });
    } else {
      Chapter.find({ course: course._id })
        .then((chapters) => res.status(200).json(chapters))
        .catch((err) => res.stauts(400).json(err));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//add chapter
router.post("/:idCourse", auth, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const course = await Course.findById(req.params.idCourse);
  if (!course)
    res.status(400).json({ success: false, message: "no course found !" });
  if (!teacher)
    res.status(400).json({ success: false, message: "your not a teacher" });
  if (teacher._id.toString() === course.teacher.toString()) {
    new Chapter({
      course: req.params.idCourse,
      ...req.body,
    })
      .save()
      .then(() =>
        res.status(200).json({ success: true, message: "chapter add" })
      )
      .catch((err) => {
        res.status(400).json(err);
      });
  } else
    res
      .status(400)
      .json({ success: false, message: "you are not the owner of the course" });
});
//update chpater
router.put("/:id", auth, async (req, res) => {
  Chapter.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body },
  })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json(err));
});
//delete chapter
router.delete("/:id", auth, async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (chapter) {
    const teacher = await Teacher.findOne({ user: req.user.id });
    const course = await Course.findById(chapter.course);
    if (course) {
      if (teacher) {
        if (teacher._id.toString() === course.teacher.toString()) {
          Chapter.findByIdAndDelete(req.params.id).then(() =>
            res.status(200).json("deleted")
          );
        } else res.status(400).json("not allowed");
      } else res.status(400).json("no teacher loged in");
    } else res.status(400).json("invalid chapter id");
  }
});
module.exports = router;
