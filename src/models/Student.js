import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const Student = sequelize.define("Student", {
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

}, {
  tableName: "students",
  timestamps: true,
});

export default Student;
