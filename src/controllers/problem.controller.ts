import { ApiError, ApiResponse } from "../utils/ApiBase";
import { NextFunction, Request, Response } from "express";
import Problem from "../models/problem.model";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import Streak from "../models/streak.model";
import { Types } from "mongoose";
import { getTopUser, updateLeaderboard } from "./leaderboard.controller";

const updateStreak = async (userID: Types.ObjectId) => {
  try {
    let streakRecord = await Streak.findOne({ user: userID });
    const now = new Date();

    if (!streakRecord) {
      streakRecord = await Streak.create({
        user: userID,
        streak: 1,
        lastCompletionDate: now,
      });
    } else {
      const lastDate = streakRecord.lastCompletionDate;
      const timeDifference = now.getTime() - lastDate.getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 48) {
        streakRecord.streak += 1;
       
      } else {
        streakRecord.streak = 0;
      }
    }
    await streakRecord.save();
    return streakRecord._id as Types.ObjectId;
  } catch (error) {
    throw new ApiError(500, "Error updating streak");
  }
};

const getProblems = async (
  req: Request & { user: IUser },
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

    if (!problems) throw new ApiError(404, "Failed to fetch problems");

    const userProblem = await User.findById({ _id: user._id });

    // Get solved problems
    const solvedProblems = new Set(
      user.solvedChallenges.map((solved) => solved.challenge.toString())
    );

    // Update the status of problems
    const problemWithStatus = problems.map((problem) => ({
      ...problem.toObject(),
      done: solvedProblems.has(problem._id.toString()),
    }));

    res.status(200).json(
      new ApiResponse(200, "Problem fetched successfully", {
        questions: problemWithStatus,
        score: user.totalScore,
        questionDone: userProblem.solvedChallenges.length,
      })
    );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const getAProblems = async (
  req: Request & { user: IUser },
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

const postProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, points, flag } = req.body;

    if (!title || !description || !category || !points || !flag) {
      res.status(400).json(new ApiError(400, "Missing required fields"));
      return;
    }

    const existProblem = await Problem.findOne({ title: title });
    if (existProblem)
      throw new ApiError(409, "Please choose a different title");

    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json(new ApiResponse(201, "Problem created successfully"));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const updateProblem = async (req: Request, res: Response): Promise<void> => {
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

const deleteProblem = async (
  req: Request<{ id: string }>,
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

const validateFlagAndIncrementUserScore = async (
  req: Request & { user?: IUser },
  res: Response
): Promise<any> => {
  try {
    const { flag } = req.body;
    const userID = req.user?._id;
    const problemID = req.params.id;

    if (!userID) {
      throw new ApiError(401, "Unauthorized. User not found.");
    }

    if (!flag) throw new ApiError(400, "Provide the flag");

    const problem = await Problem.findById(problemID).select("flag points");

    if (!problem) throw new ApiError(404, "Problem not found");

    if (flag !== problem.flag) throw new ApiError(401, "Incorrect flag");

    const user = await User.findById(userID);
    if (!user) throw new ApiError(404, "User not found");

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

    // Handle Streak Updation
    const streakID = await updateStreak(userID);
    user.streak = streakID;

    // Update Leaderboard
    await updateLeaderboard(userID, user.totalScore);

    // Update User rank
    const rank = await getTopUser(-1);
    const userRank = rank.findIndex(
      (user) => user.userID.toString() === userID.toString()
    );
    user.rank = userRank + 1;

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Challenge Solved"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export {
  deleteProblem,
  getAProblems,
  getProblems,
  postProblems,
  updateProblem,
  validateFlagAndIncrementUserScore,
};
