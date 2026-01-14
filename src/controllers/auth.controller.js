import * as authService from "../services/auth.service.js";

export const registerStudent = async (req, res) => {
  try {
    const user = await authService.registerStudent(req.body);
    res.status(201).json({ success: true, userId: user.id });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
