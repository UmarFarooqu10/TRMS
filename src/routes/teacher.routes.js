import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import {
  getProfile,
  updateProfile,
  dashboard,
  listTeachers,
  getReviews,
  getPublicTeacher,
  getPublicTeacherReviews,
} from "../controllers/teacher.controller.js";

const router = express.Router();

router.get("/", listTeachers);
router.get("/public/:id", getPublicTeacher);
router.get("/public/:id/reviews", getPublicTeacherReviews);

router.use(authenticate);
router.use(authorize("TEACHER"));

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/dashboard", dashboard);
router.get("/reviews", getReviews);

export default router;
