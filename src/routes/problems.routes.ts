import { Router } from "express";
import {
  deleteProblem,
  getAProblems,
  getProblems,
  postProblems,
  updateProblem,
  validateFlagAndIncrementUserScore,
} from "../controllers/problem.controller";
import { authValidation } from "../middlewares/authValidation";
import { sanitizeForFlag } from "../middlewares/inputValidation";

const router = Router();

/*********** Protected Routes *********/

// GET:/problems
router.get("/problems", authValidation, getProblems);

// GET:/problem/:id
router.get("/problem/:id", authValidation, getAProblems);

// POST:/problem
router.post("/problem", authValidation, postProblems);

// PUT:/problem/:id
router.put("/problem/:id", authValidation, updateProblem);

// DELETE:/problem/:id
router.delete("/problem/:id", authValidation, deleteProblem);

// Flag Validation route
router.post(
  "/validateFlag/:id",
  sanitizeForFlag,
  authValidation,
  validateFlagAndIncrementUserScore
);

export default router;
