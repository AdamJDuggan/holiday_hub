"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party
var express = require("express");
// Controller
var _a = require("../controllers/goals"), getGoals = _a.getGoals, postGoal = _a.postGoal, updateGoal = _a.updateGoal, deleteGoal = _a.deleteGoal;
// Middleware
var isValidMongoId = require("../middleware/errorMiddleware").isValidMongoId;
var goalRouter = express.Router();
goalRouter.route("/").get(getGoals).post(postGoal);
goalRouter.use("/:id", isValidMongoId);
goalRouter.route("/:id").put(updateGoal).delete(deleteGoal);
module.exports = goalRouter;
