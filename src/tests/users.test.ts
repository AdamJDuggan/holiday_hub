// 3rd party
const request = require("supertest");
// Server
const app = require("../../index");
// Services
const { mongoConnect, mongoDisconnect } = require("../services/mongo");

describe("User tests...", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test POST /api/users/login", () => {
    test("It should respond with 200 success", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "chun@li.com", password: "1234" });
      expect(res.statusCode).toBe(200);
    });
  });
});
