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
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(400, "Bad request: Token is missing");

    const decodedToken = jwt.verify(token, config.JWT_SECRET) as DecodedToken;
    if (!decodedToken) throw new ApiError(401, "Invalid access token");

    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(401, "Invalid access token");

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(error.status || 401)
      .json(new ApiError(401, error?.message || "Invalid access token"));
  }
};

export { authValidation };
