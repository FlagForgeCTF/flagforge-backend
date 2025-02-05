import express from "express";
import { authLogout } from "../controllers/auth.controller";
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
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

// Logout route
router.get("/logout", authLogout);

//Password reset
router.route("/requestResetPassword").post(requestResetPasswordHandler);
router.route("/resetPassword").post(resetPasswordHandler);

export default router;
