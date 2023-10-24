const mongoose = require("mongoose");

const blacklist = new mongoose.Schema(
  {

    value: {
      type: String,
      required: [true, "Please add a value"],
    },
    expires: {
      type: Date,
      required: [true, "Please add a value"]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blacklist", blacklist);