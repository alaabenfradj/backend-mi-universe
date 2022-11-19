var express = require("express");
var router = express.Router();
var upload = require("../middleware/courseUpload");
const {
  courseValidator,
  courseUpdateValidator,
  courseSearchValidator,
  courseTreeValidator,
} = require("../validators/courseValidator");
var ObjectId = require("mongoose").Types.ObjectId;
const { auth } = require("../lib/utils");
const { verifyTokenTeacher } = require("../middleware/verifyToken");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const validate = require("../middleware/validation");
const { authenticate } = require("passport");
const course = require("../models/course");
const teacher = require("../models/teacher");

/**
 *
 */
router.get("/get-courses", (req, res) => {
  Course.aggregate()
    .addFields({ subscribers: { $size: ["$students"] } })
    .then((courses) => {
      if (!courses) res.status(204).json("no content");
      res.status(200).json(courses);
    });
});
router.get("/get-course/:id", (req, res) => {
  Course.findById(req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(400).json(err));
});

//get courses by teacher
router.get("/course-teacher", auth, async (req, res) => {
  const teacher = await Teacher.findOne().where("user").equals(req.user.id);

  if (!teacher) {
    return res.status(400).json({
      success: false,
      message: "could not find teacher logged in",
    });
  }
  Course.aggregate()
    .addFields({ subscribers: { $size: ["$students"] } })
    .match({ teacher: teacher._id })
    .then((result) => {
      if (!result)
        res.status(404).json("this teacher does not have any courses yet !");
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});
//add course
router.post("/add", auth, upload, async (req, res) => {
  const teacher = await Teacher.findOne().where("user").equals(req.user.id);
  if (teacher) {
    req.body.teacher = teacher.id;
    if (req.file)
      new Course({ ...req.body, CourseImage: req.file.filename })
        .save()
        .then((course) => {
          return res.status(201).json({
            success: true,
            message: "courses created !",
            course: course,
          });
        })
        .catch((err) => {
          return res.status(500).json({ success: false, message: err.message });
        });
    else
      new Course({ ...req.body })
        .save()
        .then((course) => {
          return res.status(201).json({
            success: true,
            message: "courses created !",
            course: course,
          });
        })
        .catch((err) => {
          return res.status(500).json({ success: false, message: err.message });
        });
  } else {
    return res
      .status(500)
      .json({ success: false, message: "you're not logged in as a teacher" });
  }
});
//update course

router.put(
  "/update-course/:id",
  auth,
  upload,
  validate(courseUpdateValidator),
  async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "invalid ID",
      });
    }
    //get teacher related to the user logged in
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (teacher) {
      //get Courses with the id related to the teacher
      let courseToUpdate = await Course.findOne()
        .where("_id")
        .equals(req.params.id);
      if (courseToUpdate.teacher.toString() == teacher.id.toString()) {
        if (req.file) {
          Course.findByIdAndUpdate(req.params.id, {
            $set: { ...req.body, CourseImage: req.file.filename },
          })
            .then(() => {
              return res.status(200).json({
                success: true,
                message: "course updated",
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: false,
                message: "course did not update error :" + err.message,
              });
            });
        } else {
          Course.findByIdAndUpdate(req.params.id, {
            $set: { ...req.body },
          })
            .then(() => {
              return res.status(200).json({
                success: true,
                message: "course updated",
              });
            })
            .catch((err) => {
              return res.status(500).json({
                success: false,
                message: "course did not update error :" + err.message,
              });
            });
        }
      } else {
        return res.status(500).json({
          success: false,
          message: "you're not allowed to update a course that is not yours",
        });
      }
    } else {
      return res
        .status(500)
        .json({ success: false, message: "you're not a teacher" });
    }
  }
);
//delete
router.delete("/:id", auth, async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id });
  const course = await Course.findOne({ _id: req.params.id });
  if (!course) {
    return res.status(500).json({
      success: false,
      message: "could not find course",
    });
  }
  if (course.teacher.toString() === teacher._id.toString()) {
    Course.findByIdAndDelete(req.params.id)
      .then(() => {
        return res
          .status(200)
          .json({ success: true, message: "deleted successfully !" });
      })
      .catch((err) => {
        return res.status(400).json({ success: false, message: err.message });
      });
  } else {
    return res.status(400).json({
      success: false,
      message: "you're not allowed to delete this course",
    });
  }
});

router.put("/subscribe-course/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  }
  const teacher = await Teacher.findOne({ user: req.user.id });
  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    return res.status(400).json({
      success: false,
      message: "could not find student logged in",
    });
  } else {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "could not find course",
      });
    } else {
      //verfication teacher
      if (teacher !== null) {
        if (course.teacher.toString() === teacher._id.toString())
          return res.status(400).json({
            success: false,
            message: "you are the owner of the course",
          });
      }

      //if the student is subscribed to the course already !
      var match = await course.students.filter(
        (s) => s.toString() == student.id.toString()
      );
      //if match == true maaneha el course does'nt have any student with the ID provided
      if (match.length == 0) {
        course.students.push(student._id);
        course
          .save()
          .then(() => {
            return res.status(200).json({
              success: true,
              message: "subscribed to course",
              course: course.label,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              success: false,
              message: err.message,
            });
          });
      } else {
        return res.status(400).json({
          success: false,
          message: "already subscribed to this course",
        });
      }
    }
  }
});

router.put("/unsubscribe-course/:id", [auth], async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "invalid ID",
    });
  }
  const student = await Student.findOne().where("user").equals(req.user.id);
  if (!student) {
    return res.status(400).json({
      success: false,
      message: "could not find student logged in",
    });
  } else {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "could not find course",
      });
    } else {
      course.students.splice(student.id, 1);
      await course.save().then(() => {
        return res.status(200).json({
          success: true,
          message: "unsubscribed from course",
          course: course.label,
        });
      });
    }
  }
});
//get student courses
router.get("/student-course", auth, async (req, res) => {
  const student = await Student.findOne().where("user").equals(req.user.id);

  if (!student) {
    return res.status(400).json({
      success: false,
      message: "could not find student logged in",
    });
  }
  console.log(student._id);
  Course.aggregate()
    .addFields({ subscribers: { $size: ["$students"] } })
    .match({ students: { $all: [student._id] } })
    .then((result) => {
      if (!result)
        res.status(204).json("you are not subscribe yet to any course !");
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message });
    });
});
//recherche multi critere
router.put("/searchCourse", async (req, res) => {
  var maxprice = await Course.find().sort({ price: -1 }).limit(1);
  var minprice = await Course.find().sort({ price: 1 }).limit(1);
  var maxduration = await Course.find().sort({ duration: -1 }).limit(1);
  var minduration = await Course.find().sort({ duration: 1 }).limit(1);
  if (req.body.maxprice) maxprice = req.body.maxprice;
  else maxprice = maxprice[0].price;
  if (req.body.minprice) minprice = req.body.minprice;
  else minprice = minprice[0].price;
  if (req.body.maxduration) maxduration = req.body.maxduration;
  else maxduration = maxduration[0].duration;
  if (req.body.minduration) minduration = req.body.minduration;
  else minduration = minduration[0].duration;
  if (req.body.description == null) delete req.body.description;
  if (req.body.languages == null) delete req.body.languages;
  if (req.body.category == null) delete req.body.category;
  if (req.body.label == null) delete req.body.label;
  if (req.body.level == null) delete req.body.level;
  delete req.body.maxprice;
  delete req.body.minprice;
  delete req.body.maxduration;
  delete req.body.minduration;
  course
    .aggregate()
    .addFields({ subscribers: { $size: ["$students"] } })
    .match({
      ...req.body,
      price: { $gte: minprice, $lte: maxprice },
      duration: { $gte: minduration, $lte: maxduration },
    })
    .then((courses) => res.json(courses))
    .catch((err) => res.status(400).json(err));
});
//tri multi critere and order
router.get("/sort", validate(courseTreeValidator), async (req, res) => {
  Course.aggregate()
    .addFields({ subscribers: { $size: ["$students"] } })
    .sort({ ...req.body })
    .then((courses) => res.json(courses))
    .catch((err) => res.status(400).json(err));
});
router.get("/details", async (req, res) => {
  var maxprice = await Course.aggregate()
    .project({ price: 1 }, { id: 0 })
    .sort({ price: -1 })
    .limit(1);
  var minprice = await Course.aggregate()
    .project({ price: 1 }, { id: 0 })
    .sort({ price: 1 })
    .limit(1);
  var maxduration = await Course.aggregate()
    .project({ duration: 1 }, { id: 0 })
    .sort({ duration: -1 })
    .limit(1);
  var minduration = await Course.aggregate()
    .project({ duration: 1 }, { id: 0 })
    .sort({ duration: 1 })
    .limit(1);
  if (maxprice == null) {
    (maxprice = 0), (minprice = 0);
  } else {
    maxprice = maxprice[0].price;
    minprice = minprice[0].price;
  }
  if (maxduration == null) {
    (maxduration = 0), (minduration = 0);
  } else {
    maxduration = maxduration[0].duration;
    minduration = minduration[0].duration;
  }

  res.status(200).json({ maxprice, minprice, maxduration, minduration });
});
/**
 *
 * chapter part
 *
 */

module.exports = router;
