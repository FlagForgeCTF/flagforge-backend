import { IUser, IUserMethods, UserModel } from "./../interfaces/user.interface";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";


const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    displayName: String,
    avatar: String,
    role: {
      type: String,
      enum: ["participant", "admin"],
      default: "participant",
    },
    team: mongoose.Schema.Types.ObjectId,
    score: { type: Number, default: 0 },
    solvedChallenges: [
      {
        challenge: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
      },
    ],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 0);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      displayName: this.displayName,
      avatar: this.avatar,
    },
    config.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

userSchema.methods.toOBJ = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema, "users");

export default User;
