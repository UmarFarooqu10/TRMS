import {
  findUserByEmail,
  createUser
} from "../repository/auth.repository.js";

import {
  hashPassword,
  comparePassword
} from "../utils/password.util.js";

import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.util.js";

import { saveRefreshToken } from "../repository/token.repository.js";

export const registerStudent = async ({ email, password }) => {
  if (!email.endsWith(".edu")) {
    throw new Error("Only EDU email allowed");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    email,
    passwordHash,
    role: "STUDENT",
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user || user.status !== "ACTIVE") {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const payload = { id: user.id, role: user.role };

  const refreshToken = generateRefreshToken(payload);

  await saveRefreshToken({
    userId: user.id,
    token: refreshToken,
  });

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  };
};
