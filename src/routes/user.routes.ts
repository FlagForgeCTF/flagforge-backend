import { Router } from "express";
import {
  logOutHandler,
  loginUserHandler,
  registerUserHandler,
  rotateTokenHandler,
  leaderboardHandler
} from "../controllers/user.controller";
import {
  sanitizeForLogin,
  sanitizeForRegister,
} from "../middlewares/inputValidation";

const router = Router();

router.route("/signup").post(sanitizeForRegister, registerUserHandler);
router.route("/login").post(sanitizeForLogin, loginUserHandler);
router.route("/rotateToken").post(rotateTokenHandler);
router.route("/logout").get(logOutHandler);

router.route("/leaderboard").get(leaderboardHandler);

export default router;
