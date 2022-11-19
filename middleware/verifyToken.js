const { validatePassword } = require("../lib/utils");

/**
 *
 *
 */
const teacher = "teacher";
const admin = "admin";
const student = "student";
const seller = "seller";
const verifyRoleInArray = (array, role) => {
  return array.includes(role);
};

const verifyTokenTeacher = (req, res, next) => {
  if (
    verifyRoleInArray(req.user.role, teacher) ||
    verifyRoleInArray(req.user.role, admin)
  ) {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not a teacher",
    });
  }
};

const verifyTokenSeller = (req, res, next) => {
  if (
    verifyRoleInArray(req.user.role, seller) ||
    verifyRoleInArray(req.user.role, admin)
  ) {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not a seller",
    });
  }
};

const verifyTokenStudent = (req, res, next) => {
  if (
    verifyRoleInArray(req.user.role, student) ||
    verifyRoleInArray(req.user.role, admin)
  ) {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not a student",
    });
  }
};
const verifyTokenAdmin = (req, res, next) => {
  if (
    verifyRoleInArray(req.user.role, admin) ||
    verifyRoleInArray(req.user.role, "super_admin")
  ) {
    next();
  } else {
    res.status(401).json({
      success: false,
      msg: "you're not an admin",
    });
  }
};
const verifyTokenSuper = (req, res, next) => {
  if (req.user.role.contains("super_admin")) {
    next();
  }
};

const verifyPassword = (req, res, next) => {
  if (req.body.oldPassword == undefined || req.body.oldPassword == "") {
    res.status(401).json({ success: false, msg: "password is required !" });
  } else {
    User.findById(req.params.id)
      .then((user) => {
        validatePassword(req.body.oldPassword, user.password).then((match) => {
          if (match) {
            next();
          } else {
            res.status(401).json({ success: false, msg: "wrong password !" });
          }
        });
      })
      .catch((e) => console.log("error", e));
  }
};

module.exports = {
  verifyTokenTeacher,
  verifyTokenSeller,
  verifyTokenStudent,
  verifyTokenSuper,
  verifyTokenAdmin,
  verifyPassword,
};
