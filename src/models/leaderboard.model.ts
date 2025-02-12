import mongoose, { Schema } from "mongoose";
import { ILeaderboard } from "../interfaces/leaderboard.interface";

const leaderboardSchema = new Schema<ILeaderboard>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  rank: { type: Number },
});

const Leaderboard = mongoose.model<ILeaderboard>(
  "Leaderboard",
  leaderboardSchema
);
export { Leaderboard };
