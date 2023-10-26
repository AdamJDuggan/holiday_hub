"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party
const request = require("supertest");
const assert = require("assert");
const { Response } = require("express");
// Server
const app = require("../../index");
// Services
const { mongoConnect, mongoDisconnect } = require("../services/mongo");
const sessionStore = require("../services/store");
// Models
const Goal = require("../models/goalModel");
const createGoal = async () => await Goal.create({ text: "Test one" });
const deleteGoal = async (id) => {
    const goal = await Goal.findById(id);
    await goal.deleteOne();
};
describe("Goals tests...", () => {
    beforeAll(async () => {
        await mongoConnect();
        // await createGoal();
    });
    afterAll(async () => {
        // await deleteGoal(testGoal._id);
        await mongoDisconnect();
    });
    describe("Test GET /goals", () => {
        test("It should respond with 200 success", async () => {
            const res = await request(app).get("/api/goals");
            expect(res.statusCode).toBe(200);
        });
    });
    describe("Test POST /goals", () => {
        test("It should respond with 201 created", async () => {
            const res = await request(app)
                .post("/api/goals")
                .send({ text: "Goal One!" });
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Goal created");
            await deleteGoal(res.body.id);
        });
        test("It should catch missing required properties", async () => {
            const res = await request(app).post("/api/goals").send({});
            expect(res.statusCode).toBe(400);
            console.log("RES!", res);
            expect(res.body.message).toBe("Please add a text field");
        });
    });
    // describe("Test POST /goals", () => {
    //   test("It should respond with 201 created", async () => {
    //     const res = await request(app)
    //       .post("/api/goals")
    //       .send({ text: "Goal One" });
    //     expect(res.statusCode).toBe(201);
    //     const goal = await Goal.findById(res.body.id);
    //     await goal.deleteOne();
    //   });
    //   test("It should catch missing required properties", async () => {
    //     const res = await request(app).post("/api/goals").send({});
    //     expect(res.body.message).toBe("Please add a text field");
    //   });
    // });
    describe("Test PUT /goals", () => {
        test("It should respond with 200 updated", async () => {
            const goalToUpdate = await createGoal();
            await request(app)
                .put(`/api/goals/${goalToUpdate._id}`)
                .send({ text: "Goal One updated" })
                .expect(200);
            await deleteGoal(goalToUpdate.id);
        });
    });
    describe("Test DELETE /goals", () => {
        test("It should respond with 200", async () => {
            const goalToDelete = await createGoal();
            await request(app).delete(`/api/goals/${goalToDelete._id}`).expect(200);
        });
    });
});
