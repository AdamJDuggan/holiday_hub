const mongoose = require( "mongoose");
const dotenv = require( "dotenv");
// Required to run tests
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once("open", () => console.log("MongoDB ready"));
mongoose.connection.on("error", (err: object) => console.error("MongoDB error: ", err));

const mongoConnect = async () => {
  await mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { mongoConnect, mongoDisconnect };
