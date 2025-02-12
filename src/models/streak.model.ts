import mongoose, { Schema } from "mongoose";
import { IStreak } from "../interfaces/streak.interface";

const streakSchema = new Schema<IStreak>({
  streak: {
    type: Number,
    require: true,
    default: 0,
  },
  lastCompletionDate: {
    type: Date,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// TTL index on lastCompletionDate
streakSchema.index({ lastCompletionDate: 1 }, { expireAfterSeconds: 172800 });

const Streak = mongoose.model<IStreak>("Streak", streakSchema, "streaks");

export default Streak;
