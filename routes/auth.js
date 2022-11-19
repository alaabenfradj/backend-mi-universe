const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { userValidator } = require("../validators/userValidator");
const { validationResult } = require("express-validator");

const passport = require("passport");

//REGISTER
router.post("/register", [userValidator], async (req, res) => {
  const errors = validationResult(req).errors;
  if (errors.length !== 0) return res.status(403).json(errors);
  else {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.firstName + " " + req.body.lastName,
      email: req.body.email,
      birthDate: req.body.birthDate,
      sex: req.body.sex,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      profilePicture: req.body.profilePicture,
      password: hashedPassword,
      role: req.body.role,
    });
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//LOGIN

router.post("/login", passport.authenticate("local"), async (req, res) => {
  try {
    const accessToken = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
      },
      process.env.JWT_SEC,
      { expiresIn: "15d" }
    );
    let user = { ...req.user._doc, accessToken };
    res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
