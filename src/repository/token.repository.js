import RefreshToken from "../models/RefreshToken.js";

export const saveRefreshToken = (data) => {
  return RefreshToken.create(data);
};

export const findRefreshToken = (token) => {
  return RefreshToken.findOne({ where: { token, isRevoked: false } });
};

export const revokeToken = (token) => {
  return RefreshToken.update(
    { isRevoked: true },
    { where: { token } }
  );
};
