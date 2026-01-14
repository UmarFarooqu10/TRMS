import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").exists(),
];
