import { NextFunction, Request, Response } from "express";
import problem from "../models/problem";

export const getProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        const problems = await problem.find().select("-flag").skip(skip).limit(limit);

        res.status(200).json({ success: true, data: problems });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: (error as Error).message,
        });
    }
};

export const getAProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const problemId = req.params.id;
    console.log(problemId);
    try {
        const foundProblem = await problem.findById(problemId).select("-flag").exec();

        if (!foundProblem) {
            res.status(404).json({ success: false, message: "Problem not found" });
            return;
        }

        res.status(200).json({ success: true, data: foundProblem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


export const postProblems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, category, points, flag } = req.body;

        if (!title || !description || !category || !points || !flag) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        const newProblem = new problem(req.body);
        await newProblem.save();

        res.status(201).json({ success: true, message: "Problem created successfully", data: newProblem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: (error as Error).message });
    }
};


export const updateProblem = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedProblem = await problem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProblem) {
            res.status(404).json({ success: false, message: "Problem not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Problem updated successfully", data: updatedProblem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: (error as Error).message });
    }
};



export const deleteProblem = async (req: Request<{ id: string; }>, res: Response): Promise<void> => {
    try {
        const deletedProblem = await problem.findByIdAndDelete(req.params.id);
        if (!deletedProblem) {
            res.status(404).json({ success: false, message: "Problem not found" });
            return;
        }
        res.json({ success: true, message: "Problem deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: (error as Error).message });
    }
};