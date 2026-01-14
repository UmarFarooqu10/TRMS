import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("ADMIN", "STUDENT", "TEACHER"),
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
    defaultValue: "ACTIVE",
  },
}, {
  tableName: "users",
  timestamps: true,
});

export default User;
