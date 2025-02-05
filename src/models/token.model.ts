import mongoose, { Types } from "mongoose";

const tokenSchema = new mongoose.Schema({
  userID: {
    type: Types.ObjectId,
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
const Token = mongoose.model("Token", tokenSchema);

export default Token;
