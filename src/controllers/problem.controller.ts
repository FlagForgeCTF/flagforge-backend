import { ApiError, ApiResponse } from "../utils/ApiBase";
import { NextFunction, Request, Response } from "express";
import Problem from "../models/problem.model";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

export const getProblems = async (
  req: Request & { user: IUser; },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const problems = await Problem.find()
      .select("-flag")
      .skip(skip)
      .limit(limit);

    if (!problems) throw new ApiError(400, "Failed to fetch problems");

    // Get solved problems
    const solvedProblems = new Set(
      user.solvedChallenges.map((solved) => solved.challenge.toString())
    );

    // Update the status of problems
    const problemWithStatus = problems.map((problem) => ({
      ...problem.toObject(),
      done: solvedProblems.has(problem._id.toString()),
    }));

    res
      .status(200)
      .json(
        new ApiResponse(200, "Problem fetched successfully", problemWithStatus)
      );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export const getAProblems = async (
  req: Request & { user: IUser; },
  res: Response
): Promise<any> => {
  const problemId = req.params.id;
  const user = req.user;

  try {
    const foundProblem = await Problem.findById(problemId)
      .select("-flag")
      .exec();

    if (!foundProblem) throw new ApiError(404, "Problem not found");

    // Validate status of the problem 
    if (
      user.solvedChallenges.some(
        (solved) => solved.challenge.toString() === foundProblem._id.toString()
      )
    ) {
      foundProblem.done = true;
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Problem found", foundProblem));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export const postProblems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, points, flag } = req.body;

    if (!title || !description || !category || !points || !flag) {
      res.status(400).json(new ApiError(400, "Missing required fields"));
      return;
    }

    const newProblem = new Problem(req.body);
    await newProblem.save();

    res
      .status(201)
      .json(new ApiResponse(201, "Problem created successfully", newProblem));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export const updateProblem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProblem) {
      res.status(404).json(new ApiError(404, "Problem not found"));
      return;
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "Problem updated successfully", updatedProblem)
      );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export const deleteProblem = async (
  req: Request<{ id: string; }>,
  res: Response
): Promise<void> => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
    if (!deletedProblem) {
      res.status(404).json(new ApiError(404, "Problem not found"));
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Problem deleted successfully", ""));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export const validateFlag = async (
  req: Request & { user?: IUser; },
  res: Response
): Promise<any> => {
  try {
    const { flag } = req.body;
    const userID = req.user._id;
    const problemID = req.params.id;

    if (!flag) throw new ApiError(400, "Provide the flag");

    const problem = await Problem.findById(problemID).select("flag points");

    if (!problem) throw new ApiError(500, "An error occured");

    if (flag !== problem.flag) throw new ApiError(401, "Incorrect flag");

    // Increment user score
    const user = await User.findById(userID);
    if (!user) throw new ApiError(400, "User not found");

    if (
      user.solvedChallenges.some(
        (solved) => solved.challenge.toString() === problemID
      )
    ) {
      throw new ApiError(400, "Challenge is already solved");
    }
    user.totalScore += problem.points;
    user.solvedChallenges.push({
      challenge: problem._id,
      timestamp: new Date(),
    });
    await user.save();

    return res.status(200).json(new ApiResponse(200, "Challenge Solved"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};
