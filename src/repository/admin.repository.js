import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

export const createUser = (data, transaction) => {
  return User.create(data, { transaction });
};

export const findUserByEmail = (email) => {
  return User.findOne({ where: { email } });
};

export const updateUserStatus = (userId, status) => {
  return User.update(
    { status },
    { where: { id: userId } }
  );
};

export const getAllUsers = () => {
  return User.findAll({
    attributes: ["id", "email", "role", "status", "createdAt"],
  });
};

export const logActivity = (userId, action) => {
  return ActivityLog.create({ userId, action });
};

export const getActivityLogs = () => {
  return ActivityLog.findAll({ order: [["createdAt", "DESC"]] });
};
