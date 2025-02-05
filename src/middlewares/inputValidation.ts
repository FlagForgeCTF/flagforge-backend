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

const validateDisplayName = body("displayName")
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage("Display Name is required")
  .bail()
  .matches(/^[a-zA-Z0-9\s.,'-]+$/)
  .withMessage("Display Name must contain only letters");

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
  validationResults,
];

const sanitizeForLogin = [validateEmail, validatePassword, validationResults];
export { sanitizeForRegister, sanitizeForLogin };

//   displayName: z.string(),
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// export const userLoginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// });

// export const validateData = (schema: z.ZodObject<any, any>) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       schema.parse(req.body);
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errorMessages = error.errors.map((issue: any) => ({
//           message: `${issue.path.join(".")} is ${issue.message}`,
//         }));
//         res.status(401).json(new ApiError(401, "Invalid Data", errorMessages));
//       } else {
//         res.status(500).json(new ApiError(500, "Internal Server Error"));
//       }
//     }
//   };
// };
