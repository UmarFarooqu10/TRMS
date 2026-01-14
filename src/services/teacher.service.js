import {
  createTeacherProfile,
  updateTeacherProfile,
  getTeacherAnalytics,
  getTeacherReviews,
  getAllTeachers,
  getTeacherProfile,
  getTeacherById,
} from "../repository/teacher.repository.js";
import { logActivity } from "../repository/admin.repository.js";

export const setupTeacherProfile = async (userId, data) => {
  return createTeacherProfile({ userId, ...data });
};

export const editTeacherProfile = async (userId, data) => {
  const result = await updateTeacherProfile(userId, data);
  const profile = await getTeacherProfile(userId);
  const name = profile?.name;
  await logActivity(userId, name ? `Updated teacher profile (${name})` : "Updated teacher profile");
  return result;
};

export const fetchTeacherProfile = async (userId) => {
  return getTeacherProfile(userId);
};

const requireTeacherProfile = async (userId) => {
  const profile = await getTeacherProfile(userId);
  if (!profile) {
    const error = new Error("Teacher profile not found");
    error.status = 404;
    throw error;
  }
  return profile;
};

export const fetchTeacherReviewsForTeacher = async (userId) => {
  const profile = await requireTeacherProfile(userId);
  return getTeacherReviews(profile.id);
};

export const fetchTeacherDashboard = async (userId) => {
  const profile = await requireTeacherProfile(userId);
  const analytics = await getTeacherAnalytics(profile.id);
  const reviews = await getTeacherReviews(profile.id);

  return { analytics, reviews };
};

export const browseTeachers = async ({ page, limit, sort }) => {
  const offset = (page - 1) * limit;
  const teachers = await getAllTeachers(offset, limit, sort);
  const enriched = await Promise.all(
    teachers.map(async (t) => {
      const analytics = await getTeacherAnalytics(t.id);
      return {
        ...t.toJSON(),
        averageRating: Number(analytics?.avgRating ?? 0),
      };
    })
  );
  return enriched;
};

export const fetchPublicTeacher = async (teacherId) => {
  const teacher = await getTeacherById(teacherId);
  if (!teacher) {
    const error = new Error("Teacher not found");
    error.status = 404;
    throw error;
  }

  const analytics = await getTeacherAnalytics(teacherId);
  return {
    ...teacher.toJSON(),
    averageRating: Number(analytics?.avgRating ?? 0),
    totalReviews: Number(analytics?.totalReviews ?? 0),
    uniqueStudents: Number(analytics?.uniqueStudents ?? 0),
  };
};

export const fetchPublicTeacherReviews = async (teacherId) => {
  return getTeacherReviews(teacherId);
};
