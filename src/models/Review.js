import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  studentId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  teacherId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },

  comment: {
    type: DataTypes.TEXT,
  },

}, {
  tableName: "reviews",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["studentId", "teacherId"],
    }
  ]
});

export default Review;
