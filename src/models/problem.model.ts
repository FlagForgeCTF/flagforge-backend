import mongoose, { Schema, Document } from "mongoose";
import  { IProblem } from "../interfaces/problem.interface";


const problemSchema = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    points: { type: Number, required: true },
    flag: { type: String, required: true },
    addilinks: { type: String },
    link: { type: String },
    done: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "questions" }
);

export default mongoose.model<IProblem>("Problem", problemSchema);
