var express = require("express");
var router = express.Router();
const RateCourseSchema = require("../models/rateCourse");
const Course = require("../models/course");
const User = require("../models/user");
const { auth } = require("../lib/utils");
var ObjectId = require("mongoose").Types.ObjectId;
//get all
router.get("/", (req, res) => {
  RateCourseSchema.find()
    .then((rates) => res.status(200).json(rates))
    .catch((err) => res.status(400).json(err));
});
router.get("/rate/:id", auth, (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  }
  RateCourseSchema.find({ course: req.params.id, user: req.user.id })
    .then((rates) => res.status(200).json(rates))
    .catch((err) => res.status(400).json(err));
});
//rate a course
router.post("/:id/:rate", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  }
  const course = await Course.findById(req.params.id);
  const courseRate = await RateCourseSchema.findOne({
    user: req.user.id,
    course: req.params.id,
  });
  if (!course) {
    return res
      .status(400)
      .json({ success: false, message: "could not find course" });
  }
  if (!courseRate) {
    new RateCourseSchema({
      user: req.user.id,
      course: req.params.id,
      rate: req.params.rate,
    })
      .save()
      .then((course) =>
        res.status(201).json({
          success: true,
          message: "courses rated !",
          courseRate: course,
        })
      )
      .catch((err) => res.status(400).json(err));
  } else {
    RateCourseSchema.findByIdAndUpdate(courseRate._id, {
      $set: { rate: req.params.rate },
    })
      .then(() =>
        res.status(201).json({
          success: true,
          message: "rate update !",
        })
      )
      .catch((err) => res.status(400).json(err));
  }
});
//delete Rate
router.delete("/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  } else {
    const courseRate = await RateCourseSchema.findOne({
      user: req.user.id,
      course: req.params.id,
    });
    if (!courseRate) {
      return res.status(400).json({
        success: false,
        message: "could not find course",
      });
    } else {
      RateCourseSchema.findByIdAndDelete(courseRate._id)
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "deleted successfully !" });
        })
        .catch((err) => {
          return res.status(400).json({ success: false, message: err.message });
        });
    }
  }
});
//get rate of course
router.get("/get-rate/:id", async (req, res) => {
  const rate = await RateCourseSchema.find({ course: req.params.id }).count();
  var totalRate = 0;
  if (rate != 0) {
    const val = await RateCourseSchema.aggregate([
      { $match: { course: ObjectId(req.params.id) } },
    ])
      .group({ _id: "$course", totalRate: { $avg: "$rate" } })
      .project({ totalRate: 1, _id: 0 });
    totalRate = val[0].totalRate;
  }

  res.status(200).json({ totalRate });
});
//get detail  rate
router.get("/:id", auth, async (req, res) => {
  const rate = await RateCourseSchema.find({ course: req.params.id }).count();
  var totalRate = 0;
  if (rate != 0) {
    const val = await RateCourseSchema.aggregate([
      { $match: { course: ObjectId(req.params.id) } },
    ])
      .group({ _id: "$course", totalRate: { $avg: "$rate" } })
      .project({ totalRate: 1, _id: 0 });
    totalRate = val[0].totalRate;
  }
  const myrate2 = await RateCourseSchema.find({
    course: req.params.id,
    user: req.user.id,
  }).count();
  var myrate = 0;
  if (myrate2 != 0) {
    const val2 = await RateCourseSchema.find({
      course: req.params.id,
      user: req.user.id,
    });
    myrate = val2[0].rate;
  }
  res.status(200).json({ totalRate, myrate });
});

//sort by course 1asc -1desc
router.get("/sort/:order", async (req, res) => {
  RateCourseSchema.aggregate()
    .group({ _id: "$course", totalRate: { $avg: "$rate" } })
    .sort({ totalRate: req.params.order })
    .then((rate) => res.status(200).json(rate))
    .catch((err) => res.status(400).json(err));
});
module.exports = router;
