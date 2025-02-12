import { Types } from "mongoose";

interface ILeaderboard {
    user: Types.ObjectId;
    score?: number;
    rank?: number;
}

export { ILeaderboard };