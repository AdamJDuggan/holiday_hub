"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party
const asyncHandler = require("express-async-handler");
const { Request, Response } = require("express");
// Models
const Goal = require("../models/goalModel");
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find();
    for (let i = 0; i < goals.length - 1; i++) {
        const goal = goals[i];
        if (i === 0)
            await goal.deleteOne();
    }
    res.status(200).json(goals);
});
const postGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        return res.status(400).json({ message: "Please add a text field" });
    }
    const createdGoal = await Goal.create({
        text: req.body.text,
    });
    res.status(201).json({ message: "Goal created", id: createdGoal._id });
});
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        return res.status(400).json({ message: "Goal not found" });
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json({ id: updatedGoal._id, message: "Goal updated" });
});
const deleteGoal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) {
        return res.status(400).json({ message: "Goal not found!" });
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
