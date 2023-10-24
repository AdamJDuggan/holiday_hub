"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const goalSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please add a text value"],
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model("Goal", goalSchema);
