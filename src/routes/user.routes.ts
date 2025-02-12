import { Router } from "express";
import {
  getUserProfile,
  logOutHandler,
  loginUserHandler,
  registerUserHandler,
  rotateTokenHandler,
} from "../controllers/user.controller";
import {
  sanitizeForLogin,
  sanitizeForRegister,
} from "../middlewares/inputValidation";
import { authValidation } from "../middlewares/authValidation";

const router = Router();

router.route("/signup").post(sanitizeForRegister, registerUserHandler);
router.route("/login").post(sanitizeForLogin, loginUserHandler);
router.route("/rotateToken").get(authValidation, rotateTokenHandler);
router.route("/logout").get(logOutHandler);

router.route("/getUserProfile/:id").get(authValidation, getUserProfile);

export default router;
