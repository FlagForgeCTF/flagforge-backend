import { ApiError, ApiResponse } from "../utils/ApiBase";
import { NextFunction, Request, Response } from "express";
import problem from "../models/problem";

export const getProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const problems = await problem
      .find()
      .select("-flag")
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json(new ApiResponse(200, "Problem fetched successfully", problems));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export const getAProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const problemId = req.params.id;
  
  try {
    const foundProblem = await problem
      .findById(problemId)
      .select("-flag")
      .exec();

    if (!foundProblem) {
      res.status(404).json(new ApiError(404, "Problem not found"));
      return;
    }

    res.status(200).json(new ApiResponse(200, "Problem found", foundProblem));
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

    const newProblem = new problem(req.body);
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
    const updatedProblem = await problem.findByIdAndUpdate(
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
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const deletedProblem = await problem.findByIdAndDelete(req.params.id);
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
