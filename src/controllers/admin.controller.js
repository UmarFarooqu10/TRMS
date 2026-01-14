import * as adminService from "../services/admin.service.js";
import { getActivityLogs } from "../repository/admin.repository.js";

export const addTeacher = async (req, res) => {
  try {
    const teacher = await adminService.createTeacher(
      req.user.id,
      req.body
    );
    res.status(201).json({ success: true, teacherId: teacher.id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const student = await adminService.createStudentByAdmin(
      req.user.id,
      req.body
    );
    res.status(201).json({ success: true, studentId: student.id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    await adminService.deactivateUser(req.user.id, req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const listUsers = async (req, res) => {
  const users = await adminService.fetchAllUsers();
  res.status(200).json({ success: true, users });
};

export const activityLogs = async (req, res) => {
  const logs = await getActivityLogs();
  res.status(200).json({ success: true, logs });
};
