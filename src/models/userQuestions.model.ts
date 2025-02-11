import mongoose, { Schema } from "mongoose";
import { IUserQuestion } from "../interfaces/userQuestion.interface";

const userQuestionSchema = new Schema<IUserQuestion>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questionId: {
            type: Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },
    },
    { timestamps: true, }
);
const UserQuestion = mongoose.model<IUserQuestion>("UserQuestion", userQuestionSchema, "userquestions");
export default UserQuestion;
