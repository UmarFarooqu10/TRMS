import {
  submitReview,
  hasStudentReviewed,
  updateStudentReview,
  getStudentReviewsWithTeacher,
} from "../repository/student.repository.js";
import { getTeacherById } from "../repository/teacher.repository.js";
import { logActivity } from "../repository/admin.repository.js";

export const rateTeacher = async (studentId, teacherId, data) => {
  const existing = await hasStudentReviewed(studentId, teacherId);
  if (existing) {
    throw new Error("You already reviewed this teacher");
  }

  const review = await submitReview({
    studentId,
    teacherId,
    rating: data.rating,
    comment: data.comment,
  });

  const teacher = await getTeacherById(teacherId);
  const teacherLabel = teacher?.name ? `${teacher.name} (#${teacherId})` : `ID ${teacherId}`;
  await logActivity(studentId, `Reviewed teacher ${teacherLabel}`);

  return review;
};

export const updateReview = async (studentId, teacherId, data) => {
  const existing = await hasStudentReviewed(studentId, teacherId);
  if (!existing) {
    const error = new Error("Review not found for this teacher");
    error.status = 404;
    throw error;
  }

  await updateStudentReview(studentId, teacherId, {
    rating: data.rating,
    comment: data.comment,
  });

  const teacher = await getTeacherById(teacherId);
  const teacherLabel = teacher?.name ? `${teacher.name} (#${teacherId})` : `ID ${teacherId}`;
  await logActivity(studentId, `Updated review for teacher ${teacherLabel}`);
};

export const listStudentReviews = (studentId) => {
  return getStudentReviewsWithTeacher(studentId);
};
