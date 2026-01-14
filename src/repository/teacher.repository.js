import Teacher from "../models/Teacher.js";
import Review from "../models/Review.js";
import { sequelize } from "../../config/database.js";

export const createTeacherProfile = (data) => {
  return Teacher.create(data);
};

export const updateTeacherProfile = (userId, data) => {
  return Teacher.upsert({ userId, ...data });
};

export const getTeacherProfile = (userId) => {
  return Teacher.findOne({ where: { userId } });
};

export const getTeacherById = (id) => {
  return Teacher.findByPk(id);
};

export const getAllTeachers = async (offset, limit, sort) => {
  return Teacher.findAll({
    offset,
    limit,
    order: [["createdAt", sort]],
  });
};

export const getTeacherAnalytics = async (teacherId) => {
  const [result] = await sequelize.query(`
    SELECT 
      COUNT(*) as totalReviews,
      AVG(rating) as avgRating,
      COUNT(DISTINCT studentId) as uniqueStudents
    FROM reviews
    WHERE teacherId = :teacherId
  `, {
    replacements: { teacherId },
  });

  return result[0];
};

export const getTeacherReviews = (teacherId) => {
  return Review.findAll({
    where: { teacherId },
    attributes: ["rating", "comment", "createdAt"],
  });
};
