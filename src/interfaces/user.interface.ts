import { Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  displayName?: string;
  avatar?: string;
  role: "participant" | "admin";
  team?: Types.ObjectId;
  score: number;
  solvedChallenges: {
    challenge: Types.ObjectId;
    timestamp: Date;
  }[];
  refreshToken: string;
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
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {}
