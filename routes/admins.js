var express = require("express");
var router = express.Router();
const { auth } = require("../lib/utils");
const { verifyTokenAdmin } = require("../middleware/verifyToken");
const Admin = require("../models/admin");
const User = require("../models/user");

router.post("/register", [auth], (req, res) => {
  const newAdmin = new Admin({
    isAdmin: req.body.isAdmin,
    user: req.user._id,
  });
  Admin.findOne({ user: req.user._id })
    .then((admin) => {
      if (admin) {
        return res
          .status(500)
          .json({ success: false, message: "Account already exists !" });
      } else {
        newAdmin.save((err, admin) => {
          if (err) {
            res.status(500).json({ success: false, message: err });
            return;
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { role: "admin" } },
            { useFindAndModify: false },
            (err, data) => {
              if (err) {
                return res.status(500).json({ success: false, message: err });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Account was registered successfully !",
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
});
module.exports = router;
