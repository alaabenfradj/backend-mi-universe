const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

/**
 *
 *
 * JWT STRATEGY !!
 *
 *
 *
 */

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SEC,
};
const jasonWebTokenStrategy = new JwtStrategy(options, (jwt_payload, done) => {
  User.findOne({ email: jwt_payload.email }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/****
 *
 *
 *FACEBOOK STRATEGY
 *
 *
 *
 */
const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.APP_ID_FB,
    clientSecret: process.env.SEC_KEY_FB,
    callbackURL: "http://localhost:5050/authentication/facebook/callback",
    // passReqToCallback: true,
    profileFields: ["id", "emails", "name"],
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
);

/***
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
google strategy

 */

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/authentication/google/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
);

/**
 *
 *
 *
 *Github
 *
 *
 */
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GIT_CLIENT_ID,
      clientSecret: process.env.GIT_CLIENT_SECRET,
      callbackURL: "http://localhost:5050/authentication/github/callback",
      scope: ["user:email"],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
/**
 *
 *
 *
 */


module.exports = () => {
  passport.use(facebookStrategy);
  passport.use(googleStrategy);
  passport.use(jasonWebTokenStrategy);
};
