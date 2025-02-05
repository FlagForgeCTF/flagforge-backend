import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiBase";
import Token from "../models/token.model";
import crypto from "crypto";
import { config } from "../utils/config";
import { sendEmail } from "../utils/sendEmail";
import { accessTokenOptions } from "../utils/options";
import { refreshTokenOptions } from "../utils/options";
import { ApiResponse } from "../utils/ApiBase";

const generateAccessAndRefreshToken = async (userID: string) => {
  const user = await User.findById(userID);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export const authLogout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.redirect("/");
    }
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/");
      }
      res.redirect("/");
    });
  });
};

const requestPasswordReset = async (email: string) => {
  if (!email) throw new ApiError(401, "Please provide the email");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User doesnot exists with this email");

  let token = await Token.findOne({ userID: user._id });
  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  new Token({
    userID: user._id,
    token: hash,
  }).save();

  const link = `${config.BASE_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
  try {
    const emailMessage = await sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.displayName, link: link },
      "../utils/templates/requestResetPassword.handlebars"
    );

    return new ApiResponse(200, emailMessage, link);
  } catch (error) {
    throw new ApiError(500, error.message, link);
  }
};

const resetPassword = async (
  userID: string,
  token: string,
  password: string
) => {
  let passwordResetToken = await Token.findOne({ userID });

  if (!passwordResetToken)
    throw new ApiError(400, "Invalid or expired password reset token");

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid)
    throw new ApiError(400, "Invalid or expired password reset token");

  const user = await User.findById(userID);
  if (!user) throw new ApiError(400, "User doesnot exists");
  user.password = password;
  await user.save();

  try {
    const emailMessage = sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.displayName,
      },
      "../utils/templates/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return new ApiResponse(200, emailMessage);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const token = async (req: Request, res: Response): Promise<any> => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    // @ts-ignore
    req.user._id.toString()
  );
  // @ts-ignore
  const userResponse = req.user.toOBJ();
  return res
    .status(200)
    .cookie("__accessToken_", accessToken, accessTokenOptions)
    .cookie("__refreshToken_", refreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, "User logged in Successfully", userResponse));
};

export { requestPasswordReset, resetPassword, token };
