import { accessTokenOptions, refreshTokenOptions } from "../utils/options";
import User from "../models/user.model";
import { ApiError, ApiResponse } from "../utils/ApiBase";
import { Request, Response } from "express";

const generateAccessAndRefreshToken = async (userID: string) => {
  const user = await User.findById(userID);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password)
      throw new ApiError(400, "Please provide all the required fields");

    const existingUser = await User.findOne({ email });

    if (existingUser)
      throw new ApiError(409, "User already exists with this email");

    const user = await User.create({
      email,
      displayName,
      password,
    });

    if (!user) throw new ApiError(500, "Failed to create a user");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id.toString()
    );

    const userResponse = user.toOBJ();
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

const loginUser = async (req: Request, res: Response): Promise<any> => {
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

    const userResponse = user.toOBJ();
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

export { registerUser, loginUser };
