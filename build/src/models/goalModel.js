"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var goalSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please add a text value"],
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model("Goal", goalSchema);
