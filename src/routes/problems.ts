import { Router } from "express";
import { deleteProblem, getAProblems, getProblems, postProblems, updateProblem } from "../controllers/problem.controller";

const router = Router();

// GET:/problems
router.get("/problems", getProblems);

// GET:/problem/:id
router.get("/problem/:id", getAProblems);

// POST:/problem
router.post("/problem", postProblems);

// PUT:/problem/:id
router.put("/problem/:id", updateProblem);

// DELETE:/problem/:id
router.delete("/problem/:id", deleteProblem);

export default router;