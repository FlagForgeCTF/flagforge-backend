import express from "express";
import { authLogout, token } from "../controllers/auth.controller";
import passport from "passport";
import {
  requestResetPasswordHandler,
  resetPasswordHandler,
} from "../controllers/user.controller";
import {
  sanitizeForEmail,
  sanitizeForPassword,
} from "../middlewares/inputValidation";

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
    session: false,
  }),
  token
);

// Logout route
router.get("/logout", authLogout);

//Password reset
router
  .route("/requestResetPassword")
  .post(sanitizeForEmail, requestResetPasswordHandler);
router
  .route("/resetPassword/:token/:id")
  .post(sanitizeForPassword, resetPasswordHandler);

export default router;
