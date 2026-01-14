import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { swaggerSetup } from "./utils/swagger.js";

const app = express();
swaggerSetup(app);

app.use(helmet());
app.use(errorHandler);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/students", studentRoutes);

export default app;
