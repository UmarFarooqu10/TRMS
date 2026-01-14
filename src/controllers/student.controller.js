import * as studentService from "../services/student.service.js";

export const reviewTeacher = async (req, res) => {
  try {
    await studentService.rateTeacher(
      req.user.id,
      req.params.teacherId,
      req.body
    );
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    await studentService.updateReview(
      req.user.id,
      req.params.teacherId,
      req.body
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(err.status || 400).json({ success: false, message: err.message });
  }
};

export const listReviews = async (req, res) => {
  try {
    const reviews = await studentService.listStudentReviews(req.user.id);
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
