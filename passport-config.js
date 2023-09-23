const User = require("./models/user");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const initialize = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          // console.log(profile._json);
          if (!user) {
            const newUser = new User({
              googleId: profile.id,
              name: profile.displayName,
            });
            await newUser.save();
            return cb(null, newUser);
          }
          return cb(null, user);
        } catch (err) {
          cb(err, null);
        }
      }
    )
  );

  //persist user data inside session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // fetch session details by using session id
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (!user) {
      return done(err, null);
    }
    return done(null, user);
  });
};

module.exports = initialize;
