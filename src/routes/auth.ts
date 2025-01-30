import express from "express";
import { authLogout } from "../controllers/auth.controller";
import passport from "passport";

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout route
router.get('/logout', authLogout);

export default router;
