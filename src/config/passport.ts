import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from "@/models/userSchema";
import connect from "@/config/db";

// Passport setup for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/callback', // Adjust the callback URL if needed
    },
    async (accessToken, refreshToken, profile, done) => {
      await connect(); // Connect to MongoDB

      try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // Existing user found
          console.log("Existing user signed in:", existingUser);
          return done(null, existingUser);
        }

        // Create a new user if doesn't exist
        const newUser = new UserModel({
          email: profile.emails[0].value,
          name: profile.displayName,
          image: profile.photos ? profile.photos[0].value : '',
          totalScore: 0,
        });

        await newUser.save(); // Save the new user
        console.log("New user created:", newUser);
        done(null, newUser); // Proceed with the user data

      } catch (err) {
        console.error("Error during sign-in:", err);
        done(err);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Save only the user ID to the session
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id); // Fetch user by ID from DB
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
