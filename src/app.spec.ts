import request from "supertest";
import app from "./app";

describe("App", () => {
  it("should receive a Hello, world!", () => {
    return request(app).get("/").expect(200, "Hello, world!");
  });

  it("should create user", () => {
    return request(app)
      .post("/users")
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "XXXXXXXX",
      })
      .expect(201, {
        name: "John Doe",
        email: "john.doe@example.com",
      });
  });
});
