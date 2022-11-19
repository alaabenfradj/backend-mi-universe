var express = require("express");
var router = express.Router();
const { auth } = require("../lib/utils");
const Chapter = require("../models/chapter");
const Teacher = require("../models/teacher");
const Resource = require("../models/resource");
const Course = require("../models/course");
const upload = require("../middleware/chapterUpload");
router.delete("/:id", auth, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const resource = await Resource.findById(req.params.id);
  const chapter = await Chapter.findById(resource.chapter);
  const course = await Course.findById(chapter.course);
  if (!chapter) res.status(400).json("no chapter found");
  if (!teacher) res.status(400).json("you are not teacher");
  if (teacher._id.toString() === course.teacher.toString()) {
    Resource.findByIdAndDelete(req.params.id)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(400).json(err));
  } else res.status(400).json("you are not the owner of the course");
});
router.get("/:id", (req, res) => {
  Resource.find({ chapter: req.params.id })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json(err));
});
router.post("/:id", auth, upload, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const chapter = await Chapter.findById(req.params.id);
  const course = await Course.findById(chapter.course);
  if (!chapter) res.status(400).json("no chapter found");
  if (!teacher) res.status(400).json("you are not teacher");
  if (teacher._id.toString() === course.teacher.toString()) {
    new Resource({
      ...req.body,
      path: req.file.filename,
      chapter: chapter._id,
      type: req.file.mimetype,
    })
      .save()
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(400).json(err));
  } else res.status(400).json("you are not the owner of the course");
});
router.put("/:id", auth, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const resource = await Resource.findById(req.params.id);
  const chapter = await Chapter.findById(resource.chapter);
  const course = await Course.findById(chapter.course);
  if (!chapter) res.status(400).json("no chapter found");
  if (!teacher) res.status(400).json("you are not teacher");
  if (teacher._id.toString() === course.teacher.toString()) {
    if (req.file) {
      Resource.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body, file: req.file.filename },
      })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json(err));
    } else {
      console.log(req.body);
      Resource.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body },
      })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json(err));
    }
  } else res.status(400).json("you are not the owner of the course");
});
module.exports = router;
