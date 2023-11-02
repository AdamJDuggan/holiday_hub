import { Request, Response } from "express";

// Node
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const { Request, Response } = require("express");
// 3rd party
const cookieParser = require("cookie-parser");
const helment = require("helmet");
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// Services
const { mongoConnect, getSessionData } = require("./src/services/mongo");
// const { sessionStore } = require("./src/services/store");
// Routes
const goalRouter = require("./src/routes/goals");
const userRouter = require("./src/routes/users");
// Services
const cache = require("./src/services/cache");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// Security realted middleware!!
app.use(helment());

// Access session cookies in requests
app.use(cookieParser());

/** Memory cache for session */
app.use(
  session({
    name: "Alpha 3",
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    // Prevents cookies from being accessed by browser JS scripts
    cookie: {
      httpOnly: true,
      secure: true,
    },
    store: MongoStore.create({ mongoUrl: MONGO_URI, ttl: 200000 }),
  })
);

/**
 * Prevent attackers sending requests with large request bodies
 * that can exhaust server memory and/or fill disk space
 */
app.use(express.urlencoded({ extended: false, limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));

//
//app.use(express.static("../dist/client")); // For local
//app.use(express.static("public")); // For docker

// Main route serving Angular app
// app.get("/", (req: Request, res: Response) => {
//   res.sendFile("index.html", { root: __dirname });
// });

/** Routes */
app.use("/api/goals", goalRouter);
app.use("/api/users", userRouter);

// Server
const startServer = async () => {
  await mongoConnect();
  await getSessionData();

  https
    .createServer(
      {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      },
      app
    )
    .listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();

module.exports = app;

/**
 * Not needed if running pm2 which will do this for us
 * Cluster to run multiple processes
 * Cluster fork() creates a new worker() which is a seperate process
 * Load balancing with round robin approach
 */
// const cluster = require( "cluster";
// const os = require( "os";
// if (cluster.isMaster) {
//   // Match clusters to number of cores on CPU
//   const numOfWorkers = os.cpus().length;
//   for (let i = 0; i < numOfWorkers; i++) {
//     cluster.fork();
//   }
// } else {
//   startServer();
// }
