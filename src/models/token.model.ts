import mongoose, { Schema } from "mongoose";
import { IToken } from "../interfaces/token.interface";

const tokenSchema = new mongoose.Schema<IToken>({
  userID: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});
const Token = mongoose.model<IToken>("Token", tokenSchema, "tokens");

export default Token;
