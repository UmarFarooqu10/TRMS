import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  tableName: "activity_logs",
  timestamps: true,
});

export default ActivityLog;
