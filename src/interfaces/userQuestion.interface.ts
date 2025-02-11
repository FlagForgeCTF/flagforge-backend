import { Schema } from "mongoose";

export interface IUserQuestion extends Document {
    userId: Schema.Types.ObjectId;
    questionId: Schema.Types.ObjectId;
}