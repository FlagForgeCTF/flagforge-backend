import { Leaderboard } from "../models/leaderboard.model";
import { redis } from "../config/database";
import { Types } from "mongoose";
import User from "../models/user.model";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiBase";
import { ApiError } from "../utils/ApiBase";

const updateLeaderboard = async (userID: Types.ObjectId, score: number) => {
  try {
    await Leaderboard.findOneAndUpdate(
      { user: userID },
      { score: score },
      { upsert: true, new: true }
    );

    await redis.zadd("leaderboard", score, userID.toString());
    return true;
  } catch (error) {
    return false;
  }
};

const getTopUser = async (limit: number = 10) => {
  try {
    const topUsers = await redis.zrevrange(
      "leaderboard",
      0,
      limit,
      "WITHSCORES"
    );

    // Fetch from MongoDB in absence of redis
    if (!topUsers) {
      const leaderBoardUser = await Leaderboard.find()
        .sort({ score: -1 })
        .populate("user", "name")
        .lean();

      const formattedLeaderboard = leaderBoardUser.map((entry) => ({
        userID: entry.user._id,
        score: entry.score,
        name: (entry.user as any).name,
      }));

      return formattedLeaderboard;
    }

    const leaderboard = [];
    for (let i = 0; i < topUsers.length; i += 2) {
      leaderboard.push({ userID: topUsers[i], score: Number(topUsers[i + 1]) });
    }

    const populatedLeaderboard = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await User.findById(entry.userID).select("name");
        return { ...entry, name: user?.name };
      })
    );
    return populatedLeaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

const getLeaderboardHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const leaderBoard = await getTopUser(10);

    if (!leaderBoard) throw new ApiError(404, "Failed to fetch leaderboard");
    res
      .status(200)
      .json(
        new ApiResponse(200, "Leaderboard fetched successfully", leaderBoard)
      );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};
export { updateLeaderboard, getLeaderboardHandler, getTopUser };
