var express = require("express");
const User = require("../models/user");
const { auth, multerUpload } = require("../lib/utils");
const bcrypt = require("bcrypt");
var router = express.Router();
const {
  verifyPassword,
  verifyTokenAdmin,
} = require("../middleware/verifyToken");
const { validationResult, check } = require("express-validator");

/* GET user by id . */
router.get("/get-by-id/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("there is no user with this ID");
    }
    res.json(user);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
/* GET blocked users . */
router.get("/block", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    const users = await User.find({ isBlocked: true }).exec();
    if (users.length) {
      res.json(users);
    } else {
      res.json("no blocked users");
    }
  } catch (error) {
    res.json(error.message);
  }
});
/* GET blocked user . */
router.put("/block/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    let userToBeBlocked = await User.findById(req.params.id);

    if (userToBeBlocked && userToBeBlocked.role !== "admin") {
      userToBeBlocked = await User.findByIdAndUpdate(userToBeBlocked._id, {
        isBlocked: true,
      });
      return res.json("user blocked successfully");
    } else {
      return res.json("you're not allowed to do that !");
    }
  } catch (error) {
    res.json(error.message);
  }
});
router.put("/unblock/:id", [auth, verifyTokenAdmin], async (req, res) => {
  try {
    let userToBeBlocked = await User.findById(req.params.id);

    if (userToBeBlocked && userToBeBlocked.role !== "admin") {
      userToBeBlocked = await User.findByIdAndUpdate(userToBeBlocked._id, {
        isBlocked: false,
      });
      return res.json("user unblocked successfully");
    } else {
      return res.json("you're not allowed to do that !");
    }
  } catch (error) {
    res.json(error.message);
  }
});
/* GET users . */
router.get("/get-all-users", [auth, verifyTokenAdmin], async (req, res) => {
  const users = await User.find({});
  if (!users.length) return res.status(404).json("no users found");
  else return res.status(200).json(users);
});




// find user with email
router.get("/email/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    res.status(200).json({ success: true, user: user });
  });
});

router.get("/logedinuser", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        user: null,
        message: "there is no user with this ID",
      });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json(error.message);
  }
});

/* delete user by id . */
router.delete(
  "/delete-by-id/:id",
  [auth, verifyTokenAdmin],
  async (req, res) => {
    try {
      const userToBeDeleted = await User.findById(req.params.id);
      if (userToBeDeleted) {
        await User.findByIdAndDelete(userToBeDeleted._id);
        return res.json("deleted successfully");
      }
    } catch (error) {
      return res.json(error.message);
    }
  }
);

router.put(
  "/updateimg/:id",
  auth,
  multerUpload.single("picture"),

  async (req, res) => {
    console.log("req.body.url");
    console.log(req.body.url);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      return res.status(500).json("Object missing");
    } else {
      User.findById(req.params.id)
        .then((user) => {
          if (!user) {
            return res.json({ msg: "user not find" });
          } else {
            User.findByIdAndUpdate(
              req.params.id,
              { $set: { profilePicture: req.body.url } },
              { useFindAndModify: false },
              (err, data) => {
                if (err) {
                  res
                    .status(500)
                    .json({ success: false, message: err.message });
                } else {
                  res.status(200).json({ success: true, image: req.body.url });
                }
              }
            );
          }
        })
        .catch((err) => console.log(err.message));
    }
  }
);

router.put("/updateprofile/:id", auth, async (req, res) => {
  try {
    if (req.user._id == req.params.id) {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        if (user._id.toString() !== req.params.id) {
          return res
            .status(500)
            .json({ sucess: false, message: "Email already used !" });
        }
      }

      const {
        firstName,
        userName,
        lastName,
        email,
        birthDate,
        phoneNumber,
        address,
        password,
        aboutMe,
      } = req.body;

      let userFields = {};
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
        userFields.password = hashedPassword;
      }
      // let hashedPassword = await bcrypt.hash(password, 10);
      if (firstName) userFields.firstName = firstName;
      if (userName) userFields.userName = userName;
      if (lastName) userFields.lastName = lastName;
      if (email) userFields.email = email;
      if (birthDate) userFields.birthDate = birthDate;
      if (phoneNumber) userFields.phoneNumber = phoneNumber;
      if (aboutMe) userFields.aboutMe = aboutMe;
      if (address) userFields.address = address;

      User.findByIdAndUpdate(req.params.id, {
        $set: userFields,
      })
        .then((result) => {
          res
            .status(200)
            .json({ success: true, message: "updated successfully !" });
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    } else {
      res.status(500).json({
        success: false,
        message:
          "not the same id that you logged in with ... something went wrong !",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
