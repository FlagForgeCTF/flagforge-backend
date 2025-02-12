
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiBase";
import { config } from "../utils/config";
import User from "../models/user.model";
import { DecodedToken } from "../interfaces/user.interface";

const authValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token =
      req.cookies?.__accessToken_ ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized: Token is missing");

    try {
      const decodedToken = jwt.verify(token, config.JWT_SECRET) as DecodedToken;

      if (!decodedToken) throw new ApiError(403, "Token expired");
      const user = await User.findById(decodedToken._id).select("-password -otherSensitiveField");

      if (!user) throw new ApiError(401, "Invalid access token");

      req.user = user;
      return next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json(new ApiError(403, "Token expired"));
      }
      throw new ApiError(401, "Invalid access token");
    }
  } catch (error) {
    return res
      .status(error.status || 401)
      .json(new ApiError(error.status || 401, error.message));
  }
};

export { authValidation };
