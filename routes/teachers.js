var express = require("express");
const { validationResult } = require("express-validator");
var router = express.Router();
const Teacher = require("../models/teacher");
const { auth, mulerUploadPdf, issueJWT } = require("../lib/utils");
const { teacherValidator } = require("../validators/teacherValidator");
const { verifyTokenAdmin, verifyTokenTeacher } = require("../middleware/verifyToken");


router.post("/register", [auth], mulerUploadPdf.array("files"), (req, res) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    res.status(500).json({ errors: errors.array() });
  } else {
    let filesarray = [];
    req.files.forEach((element) => {
      filesarray.push(element.path);
    });

    const newTeacher = new Teacher({
      about: req.body.about,
      degrees: filesarray,
      rib: req.body.rib,
      specialties: req.body.specialties,
      user: req.user._id,
    });
    Teacher.findOne({ user: req.user._id })
      .then((teacher) => {
        if (teacher) {
          return res
            .status(500)
            .json({ success: false, message: "Account already exists !" });
        } else {
          newTeacher.save((err, newTeacher) => {
            if (err) {
              res.status(500).json({ success: false, message: err.message });
              return;
            }
            User.findByIdAndUpdate(
              req.user._id,
              { $addToSet: { role: "teacher" } },
              { new: true },
              (err, data) => {
                if (err) {
                  return res.status(500).json({ success: false, message: err.message });
                } else {
                  const userToken = issueJWT(data);
                  return res.status(200).json({
                    success: true,
                    message: "Account was registered successfully. We will get back for you",
                    token: userToken.token,
                  });
                }
              }
            );
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err });
      });
  }
});


// get connected teacher
router.get("/getcurrentteacher", [auth, verifyTokenTeacher], async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id }).populate("user");
    if (!teacher) {
      return res.status(500).json({ teacher: null });;
    }
    return res.status(200).json({ teacher: teacher });
  } catch (error) {
    res.status(500).json(error.message);
  }
});


/* GET blocked teachers . */
router.get("/blocked-teachers", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    await Teacher.find()
      .populate("user")
      .exec((err, teachers) => {
        const teachersBlocked = teachers.filter((teacher) => {
          return teacher.user.isBlocked == true;
        });
        if (teachersBlocked.length) {
          res.json(teachersBlocked);
        } else {
          res.json("no blocked teachers");
        }
      });
  } catch (error) {
    res.json(error.message);
  }
});
// block teacher
router.put(
  "/block-teacher/:status/:id",
  [auth, verifyTokenAdmin],
  async (req, res) => {
    try {
      let teacherToBeBlocked = await Teacher.findById(req.params.id).populate(
        "user"
      );
      console.log(req.params.status);
      if (!teacherToBeBlocked) {
        return res.status(404).json("there is no teacher with this ID");
      } else {
        if (
          teacherToBeBlocked.user.isBlocked.toString() !== req.params.status
        ) {
          teacherToBeBlocked = await User.findByIdAndUpdate(
            teacherToBeBlocked.user,
            {
              isBlocked: req.params.status,
            }
          );
          return res.json("teacher updated successfully");
        } else if (req.params.status) {
          return res.json("teacher already disblocked");
        } else {
          return res.json("teacher already blocked");
        }
      }
    } catch (error) {
      res.json(error.message);
    }
  }
);

/* GET teachers . */
router.get("/get-all-teachers", [auth, verifyTokenAdmin], async (req, res) => {
  const teachers = await Teacher.find({}).populate("user");
  if (!teachers.length) return res.status(404).json("no teachers found");
  res.json(teachers);
});

router.get("/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json("there is no teacher with this ID");
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete(
  "/delete-teacher/:id",
  [auth, verifyTokenAdmin],
  async (req, res) => {
    try {
      const teacherToBeDeleted = await Teacher.findById(req.params.id);
      if (teacherToBeDeleted) {
        await User.findByIdAndDelete(teacherToBeDeleted.user);
        await Teacher.findByIdAndDelete(req.params.id);
        return res.json("deleted successfully");
      } else {
        return res.status(404).json("there is no teacher with this ID");
      }
    } catch (error) {
      return res.json(error.message);
    }
  }
);

module.exports = router;
