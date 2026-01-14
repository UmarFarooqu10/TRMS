import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const Teacher = sequelize.define("Teacher", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  education: {
    type: DataTypes.JSON,
  },

  courses: {
    type: DataTypes.JSON,
  },

  experienceYears: {
    type: DataTypes.INTEGER,
  },

  department: {
    type: DataTypes.JSON,
  },

}, {
  tableName: "teachers",
  timestamps: true,
});

export default Teacher;
