import { Router } from "express";
import {
  logOutHandler,
  loginUserHandler,
  registerUserHandler,
  rotateTokenHandler,
} from "../controllers/user.controller";
import {
  sanitizeForLogin,
  sanitizeForRegister,
} from "../middlewares/inputValidation";

const router = Router();

router.route("/signup").post(sanitizeForRegister, registerUserHandler);
router.route("/login").post(sanitizeForLogin, loginUserHandler);
router.route("/rotateToken").get(rotateTokenHandler);
router.route("/logout").get(logOutHandler);

export default router;
