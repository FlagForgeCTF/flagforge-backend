import { IUser } from "./../interfaces/user.interface";
import { ApiError, ApiResponse } from "../utils/ApiBase";
import { Request, Response } from "express";
import Problem from "../models/problem.model";
import User from "../models/user.model";
import Streak from "../models/streak.model";
import { Types } from "mongoose";
import { getTopUser, updateLeaderboard } from "./leaderboard.controller";
import SolvedProblem from "../models/solvedProblem.model";

const updateStreak = async (userID: Types.ObjectId, flagSubmitted: boolean) => {
  try {
    let streakRecord = await Streak.findOne({ user: userID });
    const now = new Date();

    if (!streakRecord) {
      streakRecord = await Streak.create({
        user: userID,
        streak: flagSubmitted ? 1 : 0,
        lastCompletionDate: flagSubmitted ? now : null,
      });
    } else {
      if (streakRecord.lastCompletionDate) {
        const lastDate = streakRecord.lastCompletionDate;
        const timeDifference = now.getTime() - lastDate.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference < 48) {
          streakRecord.streak += 1;
        } else {
          streakRecord.streak = 0;
        }
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
  res: Response
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

    const solvedProblem = await SolvedProblem.findOne({ user: user._id });

    let problemWithStatus;
    // Get solved problems

    const solvedProblemsMap = solvedProblem
      ? Object.fromEntries(
          solvedProblem.problems.map((problem) => [
            problem.problemID.toString(),
            problem.usedHint,
          ])
        )
      : {};

    // Update the status of problems
    problemWithStatus = problems.map((problem) => ({
      ...problem.toObject(),
      done: solvedProblemsMap.hasOwnProperty(problem._id.toString()),
      hint: solvedProblemsMap[problem._id.toString()] || false,
    }));

    res.status(200).json(
      new ApiResponse(200, "Problem fetched successfully", {
        questions: problemWithStatus,
        score: user.totalScore,
        questionDone: solvedProblem ? solvedProblem.problems.length : 0,
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
    const solvedProblem = await SolvedProblem.findOne({
      user: user._id,
    });

    if (solvedProblem) {
      const solved = solvedProblem.problems.find(
        (solved) => solved.problemID.toString() === foundProblem._id.toString()
      );

      if (solved) {
        foundProblem.done = true;
        foundProblem.hint = solved.usedHint;
      }
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

const hintHandler = async (
  req: Request & { user: IUser },
  res: Response
): Promise<any> => {
  try {
    const userID = req.user?._id;
    const problemID = req.params.id;

    let solvedProblem = await SolvedProblem.findOne({ user: userID });
    let filteredProblem = solvedProblem
      ? solvedProblem.problems.find(
          (problem) =>
            problem.problemID.toString() === problemID &&
            problem.usedHint === true
        )
      : null;
    if (filteredProblem) {
      throw new ApiError(409, "Hint is already used");
    }
    if (!solvedProblem) {
      solvedProblem = await SolvedProblem.create({
        user: userID,
        problems: [{ problemID: problemID, usedHint: true }],
      });
    } else if (
      await SolvedProblem.updateOne(
        { user: userID },
        { $push: { problems: { problemID, usedHint: true, solved: false } } }
      )
    ) {
    }

    return res.status(200).json(new ApiResponse(200, "Hint usage successful"));
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

    // Validate challenge solved or not
    let solvedProblem = await SolvedProblem.findOne({ user: userID });
    let filteredProblem = solvedProblem
      ? solvedProblem.problems.find(
          (problem) => problem.problemID.toString() === problemID
        )
      : null;

    if (filteredProblem?.solved) {
      throw new ApiError(400, "Problem already solved");
    }
    if (!solvedProblem) {
      solvedProblem = await SolvedProblem.create({
        user: userID,
        problems: [{ problemID: problem._id, solved: true }],
      });
    }
    if (!filteredProblem) {
      await SolvedProblem.updateOne(
        {
          user: userID,
        },
        { $push: { problems: { problemID, solved: true, usedHint: false } } }
      );
    }
    if (filteredProblem && !filteredProblem?.solved) {
      await SolvedProblem.updateOne(
        {
          user: userID,
          "problems.problemID": problemID,
        },
        { $set: { "problems.$.solved": true } }
      );
    }
    const user = await User.findById(userID);

    if (!user) throw new ApiError(404, "User not found");

    // Hint Validation for point deduction
    const usedHint = filteredProblem?.usedHint || false;
    user.totalScore += usedHint ? problem.points / 2 : problem.points;

    // Handle Streak Updation
    const streakID = await updateStreak(userID, true);
    user.streak = streakID;

    // Update Leaderboard
    await updateLeaderboard(userID, user.totalScore);

    // Update User rank
    const rank = await getTopUser(-1);

    const userRank = rank.findIndex(
      (user) => user.userID.toString() === userID.toString()
    );
    user.rank = userRank + 1;
    user.solvedChallenges = solvedProblem._id;

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
  hintHandler,
  updateStreak,
  validateFlagAndIncrementUserScore,
};
