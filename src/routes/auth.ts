import express from 'express';
import passport from '@/config/passport'; // Import passport configuration
import session from 'express-session';

const router = express.Router();

// Use sessions
router.use(
  session({
    secret: 'your_secret_key', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
  })
);

// Google login route
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Request email and profile scopes
    prompt: 'select_account', // Forces account selection
  })
);

// Google callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // Redirect here if authentication fails
  }),
  (req, res) => {
    // Redirect to the dashboard or desired route after successful login
    res.redirect('/dashboard');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.redirect('/'); // In case of error during logout
    }
    // Destroy the session after logging out
    req.session.destroy((err: any) => {
      if (err) {
        return res.redirect('/'); // In case of session destroy error
      }
      res.redirect('/'); // Redirect to homepage after logout
    });
  });
});

export default router;
