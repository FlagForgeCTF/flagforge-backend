import { Schema } from "mongoose";

export interface IToken extends Document {
    userID: Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
}