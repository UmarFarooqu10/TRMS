import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const RefreshToken = sequelize.define("RefreshToken", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

}, {
  tableName: "refresh_tokens",
  timestamps: true,
});

export default RefreshToken;
