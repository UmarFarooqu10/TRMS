import * as teacherService from "../services/teacher.service.js";

export const updateProfile = async (req, res) => {
  await teacherService.editTeacherProfile(req.user.id, req.body);
  res.status(200).json({ success: true });
};

export const getProfile = async (req, res) => {
  const profile = await teacherService.fetchTeacherProfile(req.user.id);
  res.status(200).json({ success: true, profile });
};

export const dashboard = async (req, res) => {
  const data = await teacherService.fetchTeacherDashboard(req.user.id);
  res.status(200).json({ success: true, data });
};

export const getPublicTeacher = async (req, res) => {
  try {
    const teacher = await teacherService.fetchPublicTeacher(req.params.id);
    res.status(200).json({ success: true, teacher });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

export const getPublicTeacherReviews = async (req, res) => {
  try {
    const reviews = await teacherService.fetchPublicTeacherReviews(req.params.id);
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

export const getReviews = async (req, res) => {
  const reviews = await teacherService.fetchTeacherReviewsForTeacher(req.user.id);
  res.status(200).json({ success: true, reviews });
};

export const listTeachers = async (req, res) => {
  const teachers = await teacherService.browseTeachers({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sort: req.query.sort || "DESC",
  });
  res.status(200).json({ success: true, teachers });
};
