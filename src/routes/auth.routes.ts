import express, { type Request, type Response } from "express";
import { authLogout, token } from "../controllers/auth.controller";
import { accessTokenOptions, refreshTokenOptions } from "../utils/options";
import passport from "passport";
import {
  requestResetPasswordHandler,
  resetPasswordHandler,
} from "../controllers/user.controller";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    accessType: "offline",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  token
);

// Logout route
router.get("/logout", authLogout);

//Password reset
router.route("/requestResetPassword").post(requestResetPasswordHandler);
router.route("/resetPassword/:token/:id").post(resetPasswordHandler);

export default router;
