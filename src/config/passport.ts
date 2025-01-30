import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  // @ts-ignore
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
