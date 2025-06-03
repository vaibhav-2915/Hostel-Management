const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user)
            return done(null, false, {
              message: "That email is not registered",
            });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return done(null, false, { message: "Password incorrect" });

          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    )
  );

  // ✅ Fix: Ensure user ID is stored in session
  passport.serializeUser((user, done) => {
    console.log("Serializing User ID:", user.id);
    done(null, user.id);
  });

  // ✅ Fix: Retrieve full user from session
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("Deserializing User ID:", id);
      const user = await User.findById(id);
      console.log("User found in DB:", user);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
