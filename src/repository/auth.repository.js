import User from "../models/User.js";

export const findUserByEmail = (email) => {
  return User.findOne({ where: { email } });
};

export const createUser = (data) => {
  return User.create(data);
};

export const findUserById = (id) => {
  return User.findByPk(id);
};
