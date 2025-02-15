import mongoose, { Schema } from "mongoose";
import { IProblem } from "../interfaces/problem.interface";

const problemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["Hard", "Medium", "Easy"],
      default: "Easy",
    },
    points: { type: Number, required: true },
    flag: { type: String, required: true },
    addilinks: { type: String },
    hint: { type: Boolean, default: false },
    link: { type: String },
    done: { type: Boolean, default: false },
  },
  { timestamps: true, }
);
const Problem = mongoose.model<IProblem>("Problem", problemSchema, "problems");
export default Problem;
