"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party
var request = require("supertest");
var assert = require("assert");
var Response = require("express").Response;
// Server
var app = require("../../index.js");
// Services
var _a = require("../services/mongo"), mongoConnect = _a.mongoConnect, mongoDisconnect = _a.mongoDisconnect;
// Models
var Goal = require("../models/goalModel");
var createGoal = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Goal.create({ text: "Test one" })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var deleteGoal = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var goal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Goal.findById(id)];
            case 1:
                goal = _a.sent();
                return [4 /*yield*/, goal.deleteOne()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
describe("Goals tests...", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoConnect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // await deleteGoal(testGoal._id);
                return [4 /*yield*/, mongoDisconnect()];
                case 1:
                    // await deleteGoal(testGoal._id);
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Test GET /goals", function () {
        test("It should respond with 200 success", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app).get("/api/goals")];
                    case 1:
                        res = _a.sent();
                        expect(res.statusCode).toBe(200);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Test POST /goals", function () {
        test("It should respond with 201 created", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app)
                            .post("/api/goals")
                            .send({ text: "Goal One!" })];
                    case 1:
                        res = _a.sent();
                        expect(res.statusCode).toBe(201);
                        expect(res.body.message).toBe("Goal created");
                        return [4 /*yield*/, deleteGoal(res.body.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test("It should catch missing required properties", function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request(app).post("/api/goals").send({})];
                    case 1:
                        res = _a.sent();
                        expect(res.statusCode).toBe(400);
                        console.log("RES!", res);
                        expect(res.body.message).toBe("Please add a text field");
                        return [2 /*return*/];
                }
            });
        }); });
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
    describe("Test PUT /goals", function () {
        test("It should respond with 200 updated", function () { return __awaiter(void 0, void 0, void 0, function () {
            var goalToUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createGoal()];
                    case 1:
                        goalToUpdate = _a.sent();
                        return [4 /*yield*/, request(app)
                                .put("/api/goals/".concat(goalToUpdate._id))
                                .send({ text: "Goal One updated" })
                                .expect(200)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, deleteGoal(goalToUpdate.id)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Test DELETE /goals", function () {
        test("It should respond with 200", function () { return __awaiter(void 0, void 0, void 0, function () {
            var goalToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createGoal()];
                    case 1:
                        goalToDelete = _a.sent();
                        return [4 /*yield*/, request(app).delete("/api/goals/".concat(goalToDelete._id)).expect(200)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
