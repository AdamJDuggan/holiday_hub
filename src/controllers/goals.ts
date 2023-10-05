// 3rd party
const asyncHandler = require("express-async-handler");
const { Request, Response } = require("express");
// Models
const Goal = require("../models/goalModel");


    

const getGoals = asyncHandler(async (req: typeof Request, res: typeof Response) => {
  const goals = await Goal.find();
  res.status(200).json(goals);
});

const postGoal = asyncHandler(async (req: typeof Request, res: typeof Response) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const createdGoal = await Goal.create({
    text: req.body.text,
  });

  res.status(201).json({ message: "Goal created", id: createdGoal._id });
});

const updateGoal = asyncHandler(async (req: typeof Request, res: typeof Response) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ id: updatedGoal._id, message: "Goal updated" });
});

const deleteGoal = asyncHandler(async (req: typeof Request, res: typeof Response) => {
  const {id} = req.params
    const goal = await Goal.findById(id);
    if(!goal){
      res.status(400);
      throw new Error("Goal not found!");
    }
      await goal.deleteOne();
      res.status(200).json({ id, message: "Goal deleted" });
  
});

module.exports = {
  getGoals,
  postGoal,
  updateGoal,
  deleteGoal,
};
