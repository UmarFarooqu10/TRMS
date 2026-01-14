import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  it("should login admin", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "admin@trms.com",
        password: "Admin@123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
