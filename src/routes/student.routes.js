import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { reviewTeacher, updateReview, listReviews } from "../controllers/student.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("STUDENT"));

router.post("/review/:teacherId", reviewTeacher);
router.patch("/review/:teacherId", updateReview);
router.get("/reviews", listReviews);

export default router;
