import Review from "../models/Review.js";
import { sequelize } from "../../config/database.js";

export const submitReview = (data) => {
  return Review.create(data);
};

export const hasStudentReviewed = (studentId, teacherId) => {
  return Review.findOne({ where: { studentId, teacherId } });
};

export const updateStudentReview = (studentId, teacherId, data) => {
  return Review.update(data, { where: { studentId, teacherId } });
};

export const getStudentReviewsWithTeacher = async (studentId) => {
  const [rows] = await sequelize.query(
    `
      SELECT 
        r.id,
        r.teacherId,
        r.rating,
        r.comment,
        r.createdAt,
        t.name AS teacherName
      FROM reviews r
      LEFT JOIN teachers t ON r.teacherId = t.id
      WHERE r.studentId = :studentId
      ORDER BY r.createdAt DESC
    `,
    { replacements: { studentId } }
  );

  return rows;
};
