import { authValidation } from "../middlewares/authValidation";
import { Router } from "express";
import { getLeaderboardHandler } from "../controllers/leaderboard.controller";

const router = Router();

router.route("/").get(getLeaderboardHandler);

export default router;
