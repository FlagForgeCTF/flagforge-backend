const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google OAuth route
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
}));

// Callback route after Google OAuth authentication
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to CTF dashboard after successful login
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
    req.session.destroy((err) => {
      if (err) {
        return res.redirect('/'); // In case of session destroy error
      }
      res.redirect('/'); // Redirect to homepage after logout
    });
  });
});

module.exports = router;
