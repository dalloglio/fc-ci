import request from "supertest";
import app from "../src/app";

describe("Testando a aplicação Express", () => {
  it("deve responder com Hello, world! na rota raiz", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, world!");
  });
});
