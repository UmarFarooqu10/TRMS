import { sequelize } from "../../config/database.js";
import {
  createUser,
  updateUserStatus,
  getAllUsers,
  logActivity,
  findUserByEmail,
} from "../repository/admin.repository.js";

import { hashPassword } from "../utils/password.util.js";

export const createTeacher = async (adminId, data) => {
  return sequelize.transaction(async (t) => {
    const existing = await findUserByEmail(data.email);
    if (existing) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const teacher = await createUser({
      email: data.email,
      passwordHash,
      role: "TEACHER",
      status: "ACTIVE",
    }, t);

    await logActivity(adminId, `Created teacher: ${data.email}`);

    return teacher;
  });
};

export const createStudentByAdmin = async (adminId, data) => {
  return sequelize.transaction(async (t) => {
    const existing = await findUserByEmail(data.email);
    if (existing) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const student = await createUser({
      email: data.email,
      passwordHash,
      role: "STUDENT",
      status: "ACTIVE",
    }, t);

    await logActivity(adminId, `Created student: ${data.email}`);

    return student;
  });
};

export const deactivateUser = async (adminId, userId) => {
  await updateUserStatus(userId, "INACTIVE");
  await logActivity(adminId, `Deactivated user ID: ${userId}`);
};

export const fetchAllUsers = async () => {
  return getAllUsers();
};
