import { body, validationResult } from "express-validator/lib";

import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/ApiBase";

const validateEmail = body("email")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("Invalid email address");

const validateDisplayName = body("name")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Name is required")
  .bail()
  .matches(/^[a-zA-Z0-9\s.,'_/-]+$/)
  .withMessage("Name must contain only letters");

const validatePassword = body("password")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Password is required")
  .bail()
  .isAlphanumeric()
  .withMessage("Password must be alphanumeric")
  .isLength({ min: 6 })
  .withMessage("Invalid password");

const validateImage = body("image").trim().escape().bail();

const validateFlag = body("flag")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Please enter the flag")
  .bail();

const validationResults = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array().map((error) => error.msg);
    return res.status(400).json(new ApiError(400, errorMessage));
  }
  next();
};

const sanitizeForRegister = [
  validateEmail,
  validateDisplayName,
  validatePassword,
  validateImage,
  validationResults,
];

const sanitizeForLogin = [validateEmail, validatePassword, validationResults];
const sanitizeForFlag = [validateFlag, validationResults];
const sanitizeForEmail = [validateEmail, validationResults];
export {
  sanitizeForRegister,
  sanitizeForLogin,
  sanitizeForFlag,
  sanitizeForEmail,
};
