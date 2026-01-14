import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../config/database.js";
import bcrypt from "bcrypt";

/**
 * This test:
 * 1. Creates a student & teacher
 * 2. Logs in student
 * 3. Submits a review
 * 4. Tries to submit the SAME review again
 * 5. Expects rejection
 */

describe("Review rules", () => {
  let studentToken;
  let teacherId;
  let studentId;

  beforeAll(async () => {
    // Ensure DB connection
    await sequelize.authenticate();

    // Create student user
    const studentPassword = await bcrypt.hash("Student@123", 12);
    const [student] = await sequelize.query(
      `
      INSERT INTO users (email, passwordHash, role, status, createdAt, updatedAt)
      VALUES ('student1@edu.com', ?, 'STUDENT', 'ACTIVE', NOW(), NOW())
      `,
      { replacements: [studentPassword] }
    );

    // Fetch student id
    const [[studentRow]] = await sequelize.query(
      `SELECT id FROM users WHERE email = 'student1@edu.com'`
    );
    studentId = studentRow.id;

    // Create teacher user
    const teacherPassword = await bcrypt.hash("Teacher@123", 12);
    await sequelize.query(
      `
      INSERT INTO users (email, passwordHash, role, status, createdAt, updatedAt)
      VALUES ('teacher1@trms.com', ?, 'TEACHER', 'ACTIVE', NOW(), NOW())
      `,
      { replacements: [teacherPassword] }
    );

    // Fetch teacher user id
    const [[teacherUser]] = await sequelize.query(
      `SELECT id FROM users WHERE email = 'teacher1@trms.com'`
    );

    // Create teacher profile
    const [[teacherProfile]] = await sequelize.query(
      `
      INSERT INTO teachers (userId, education, courses, experienceYears, createdAt, updatedAt)
      VALUES (?, 'MS CS', 'DSA', 5, NOW(), NOW())
      RETURNING id
      `,
      { replacements: [teacherUser.id] }
    );

    teacherId = teacherProfile?.id || 1;

    // Login student
    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "student1@edu.com",
        password: "Student@123",
      });

    studentToken = loginRes.body.accessToken;
  });

  it("should not allow duplicate review", async () => {
    // First review (should succeed)
    const firstReview = await request(app)
      .post(`/api/v1/students/review/${teacherId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        rating: 5,
        comment: "Excellent teacher",
      });

    expect(firstReview.statusCode).toBe(201);

    // Second review (should FAIL)
    const secondReview = await request(app)
      .post(`/api/v1/students/review/${teacherId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        rating: 4,
        comment: "Trying again",
      });

    expect(secondReview.statusCode).toBe(400);
    expect(secondReview.body.success).toBe(false);
  });

  afterAll(async () => {
    // Cleanup test data
    await sequelize.query(`DELETE FROM reviews`);
    await sequelize.query(`DELETE FROM teachers`);
    await sequelize.query(`DELETE FROM users`);
    await sequelize.close();
  });
});
