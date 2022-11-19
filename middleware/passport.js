const passport = require("passport");
const passportLocals = require("passport-local");
const User = require("../models/user");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new passportLocals.Strategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: email,
        });
        if (user) {
          let match = await bcrypt.compare(password, user.password);
          if (match) {
            done(null, user);
          } else {
            done(null, false, { message: "password is incorrect" });
          }
        }
      } catch (error) {
        done(error, false, { message: "something went bad!" });
      }
    }
  )
);
module.exports = passport;
