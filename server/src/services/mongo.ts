// 3rd party
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Models
const BlackList = require("../models/blacklistModel");

// Required to run tests
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once("open", () => console.log("MongoDB ready"));
mongoose.connection.on("error", (err: object) =>
  console.error("MongoDB error: ", err)
);

const mongoConnect = async () => {
  await mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

const isTokenBlackListed = async (id: string) => await BlackList.findById(id);

// Fire this when we start the server. Clear out expired docuements
const migrateBlackListCollection = async () => {
  const tokens = await BlackList.find();
  // Async/await does not work in forEach loop
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    if (token > Date.now()) token.deleteOne();
  }
};

module.exports = {
  mongoConnect,
  mongoDisconnect,
  isTokenBlackListed,
  migrateBlackListCollection,
};
