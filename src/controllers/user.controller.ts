import { accessTokenOptions, refreshTokenOptions } from "../utils/options";
import User from "../models/user.model";
import { ApiError, ApiResponse } from "../utils/ApiBase";
import { Request, Response } from "express";
import { requestPasswordReset, resetPassword } from "./auth.controller";
import jwt from "jsonwebtoken";
import { DecodedToken, IUser } from "../interfaces/user.interface";
import { config } from "../utils/config";
import { updateLeaderboard } from "./leaderboard.controller";
import { updateStreak } from "./problem.controller";
import { OTP } from "../models/otp.model";
import { sendEmailForOTP } from "../utils/sendEmail";

export const generateAccessAndRefreshToken = async (userID: string) => {
  const user = await User.findById(userID);
  const increasedTokenVersion = Number(user.tokenVersion) + 1;
  user.tokenVersion = increasedTokenVersion;

  await user.save({ validateBeforeSave: false });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return { accessToken, refreshToken };
};

const generateOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Please enter your email");

    const userExists = await User.findOne({ email: email });
    if (userExists)
      throw new ApiError(409, "User already exists with this email");

    const existingOTP = await OTP.findOne({ email: email });
    if (existingOTP)
      throw new ApiError(
        429,
        "OTP already generated. Please wait before requesting a new one."
      );

    let otpCode = "";
    for (let i = 0; i < 6; i++) {
      otpCode += Math.floor(Math.random() * 10);
    }

    await OTP.create({
      email: email,
      otp: otpCode,
      createdAt: new Date(),
    });

    sendEmailForOTP(
      email,
      "OTP Verification",
      { otpCode: otpCode },
      "../utils/templates/otp.handlebars"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "OTP sent successfully"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const registerUserHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
      throw new ApiError(400, "Please provide all the required fields");

    const existingUser = await User.findOne({ email });

    if (existingUser)
      throw new ApiError(409, "User already exists with this email");

    // Verify OTP
    const otpDB = await OTP.findOne({ otp: otp });
    if (!otpDB) throw new ApiError(400, "Please generate OTP first");

    if (otpDB.otp !== otp) throw new ApiError(409, "Invalid OTP");

    const user = await User.create({
      email,
      name,
      password,
    });

    if (!user) throw new ApiError(500, "Failed to create a user");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id.toString()
    );

    const userResponse = { name: user.name, image: user.image, totalScore: user.totalScore, streak: user.streak };

    // Update Leaderboard
    await updateLeaderboard(user._id, user.totalScore);

    return res
      .status(200)
      .cookie("__accessToken_", accessToken, accessTokenOptions)
      .cookie("__refreshToken_", refreshToken, refreshTokenOptions)
      .json(new ApiResponse(200, "User registered Successfully", userResponse));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const loginUserHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new ApiError(400, "Please provide all the required fields");

    const user = await User.findOne({ email });

    if (!user) throw new ApiError(404, "User doesnot exists with this email");

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) throw new ApiError(401, "Incorrect Password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id.toString()
    );

    const userResponse = { name: user.name, image: user.image, totalScore: user.totalScore, streak: user.streak };
    return res
      .status(200)
      .cookie("__accessToken_", accessToken, accessTokenOptions)
      .cookie("__refreshToken_", refreshToken, refreshTokenOptions)
      .json(new ApiResponse(200, "User logged in Successfully", userResponse));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const rotateTokenHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const refreshToken =
      req.cookies?.__refreshToken_ ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) throw new ApiError(403, "Refresh token required");

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(refreshToken, config.JWT_SECRET) as DecodedToken;
      if (!decoded) throw new ApiError(403, "Refresh Token expired");
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .clearCookie("__accessToken_")
          .clearCookie("__refreshToken_")
          .json(new ApiError(401, "Session expired. Please log in again."));
      }
      throw new ApiError(403, "Invalid refresh token");
    }

    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(401, "User not found");

    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new ApiError(403, "Refresh token mismatch");
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(decoded._id.toString());
    return res
      .status(200)
      .cookie("__accessToken_", newAccessToken, accessTokenOptions)
      .cookie("__refreshToken_", newRefreshToken, refreshTokenOptions)
      .json(new ApiResponse(200, "Access Token refreshed Successfully"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const logOutHandler = async (
  req: Request & { user: IUser; },
  res: Response
): Promise<any> => {
  try {
    const user = req.user;

    await User.findByIdAndUpdate(user._id, { $inc: { tokenVersion: 1 } });
    return res
      .clearCookie("__accessToken_", accessTokenOptions)
      .clearCookie("__refreshToken_", refreshTokenOptions)
      .json(new ApiResponse(200, "User Logged out successfully"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(500, "Failed to logout user"));
  }
};

const requestResetPasswordHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Please provide email");
    const requestPasswordResetService = await requestPasswordReset(email);
    return res.json(requestPasswordResetService);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const resetPasswordHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const token = req.params.token;
    const id = req.params.id;
    const { password } = req.body;

    await resetPassword(id, token, password);
    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset successfully"));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

const getUserProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userID = req.params.id;
    if (!userID) throw new ApiError(400, "Please provide user ID");

    const user = await User.findById(userID)
      .select("-password -tokenVersion")
      .populate("streak", "-_id streak")
      .populate({
        path: "solvedChallenges",
        select: "-_id problems",
        options: { strictPopulate: false },
      });
    if (!user) throw new ApiError(404, "User not found");

    await updateStreak(user._id, false);
    res
      .status(200)
      .json(new ApiResponse(200, "User profile fetched successfully", user));
  } catch (error) {
    return res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};

export {
  registerUserHandler,
  loginUserHandler,
  requestResetPasswordHandler,
  resetPasswordHandler,
  rotateTokenHandler,
  logOutHandler,
  getUserProfile,
  generateOTP,
};
