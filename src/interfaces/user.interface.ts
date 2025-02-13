import { Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name?: string;
  image?: string;
  role: "User" | "Admin";
  team?: Types.ObjectId;
  totalScore: number;
  solvedChallenges: {
    challenge: Types.ObjectId;
    timestamp: Date;
  }[];
  streak?: Types.ObjectId | null;
  rank?: number;
  tokenVersion: Number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  toOBJ: () => IUser;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export interface DecodedToken {
  _id: string;
  tokenVersion: number;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {}
