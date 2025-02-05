import express, { type Request, type Response } from "express";
import { authLogout, token } from "../controllers/auth.controller";
import { accessTokenOptions, refreshTokenOptions } from "../utils/options";
import passport from "passport";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  token
);

// Logout route
router.get("/logout", authLogout);

export default router;
