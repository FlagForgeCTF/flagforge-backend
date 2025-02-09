import mongoose, { Document } from "mongoose";

export interface IStreak extends Document {
  user: mongoose.Types.ObjectId;
  streak: number;
  lastCompletionDate: Date | null;
}
