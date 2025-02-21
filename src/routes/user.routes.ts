import { Router } from "express";
import {
  generateOTP,
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
router.route("/rotateToken").get(rotateTokenHandler);
router.route("/logout").get(authValidation,logOutHandler);
router.route('/otp-generate').post(generateOTP)

router.route("/getUserProfile/:id").get(authValidation, getUserProfile);

export default router;
