import mongoose, { Schema, Types } from "mongoose";
import { ISolvedProblem } from "../interfaces/solvedProblem.interface";

const solvedProblem = new Schema<ISolvedProblem>({
  user: {
    type: Schema.Types.ObjectId,

    ref: "User",
    require: true,
  },
  problems: [
    {
      problemID: {
        type: Types.ObjectId,
        ref: "Problem",
        require: true,
        unique: true,
      },
      usedHint: { type: Boolean, default: false },
      solved: { type: Boolean, default: false },
    },
  ],
});

const SolvedProblem = mongoose.model<ISolvedProblem>(
  "SolvedProblem",
  solvedProblem
);
export default SolvedProblem;
