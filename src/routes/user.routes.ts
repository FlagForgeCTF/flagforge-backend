import { Router } from "express";
import {
  logOutHandler,
  loginUserHandler,
  registerUserHandler,
  rotateTokenHandler,
} from "../controllers/user.controller";

const router = Router();

router.route("/signup").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/rotateToken").get(rotateTokenHandler);
router.route("/logout").get(logOutHandler);

export default router;
