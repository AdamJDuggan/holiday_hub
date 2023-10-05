// 3rd party
const express = require("express");
// Controller
const {
  getGoals,
  postGoal,
  updateGoal,
  deleteGoal,
} = require( "../controllers/goals");
// Middleware
const {isValidMongoId} = require("../middleware/errorMiddleware")

const goalRouter = express.Router();




goalRouter.route("/").get(getGoals).post(postGoal);


goalRouter.use("/:id", isValidMongoId);
goalRouter.route("/:id").put(updateGoal).delete(deleteGoal);

module.exports = goalRouter;
