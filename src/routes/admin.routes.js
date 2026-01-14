import express from "express";
import {
  addTeacher,
  addStudent,
  deactivateUser,
  listUsers,
  activityLogs,
} from "../controllers/admin.controller.js";
import { createUserByAdminValidator } from "../validators/admin.validator.js";
import { validate } from "../utils/validator.util.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post("/teachers", createUserByAdminValidator, validate, addTeacher);
router.post("/students", createUserByAdminValidator, validate, addStudent);
router.patch("/users/:id/deactivate", deactivateUser);
router.get("/users", listUsers);
router.get("/activity", activityLogs);

export default router;
