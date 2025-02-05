import { Request, Response } from "express";
import User from "../models/user.model";
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
            return res.redirect('/');
        }
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/');
            }
            res.redirect('/');
        });
    });
};


export const token = async (req: Request, res: Response): Promise<any> => {

    console.log(req.user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        // @ts-ignore
        req.user._id.toString()
    );

    console.log(accessToken, refreshToken);
    // @ts-ignore
    const userResponse = req.user.toOBJ();
    return res
        .status(200)
        .cookie("__accessToken_", accessToken, accessTokenOptions)
        .cookie("__refreshToken_", refreshToken, refreshTokenOptions)
        .json(new ApiResponse(200, "User logged in Successfully", userResponse));
};