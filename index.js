// Node
const fs = require("fs");
const https = require("https");
// 3rd party
const helment = require("helmet");
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");

// Services
const { mongoConnect } = require("./src/services/mongo");
// Routes
const goalRouter = require("./src/routes/goals");
const userRouter = require("./src/routes/users");
// Custom middleware
const { errorHandler } = require("./src/middleware/errorMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();

dotenv.config();

// Security realted middleware
app.use(helment());

const store = new session.MemoryStore();

// Use sessions
// TODO- intergate Redis memory cache
app.use(
  session({
    secret: "343ji43j4n3jn4jk3n",
    resave: false,
    saveUninitialized: false,
    // Prevents cookies from being accessed by browser JS scripts
    cookie: {
      httpOnly: true,
      secure: true,
    },
    store,
  })
);

app.use((req, res, next) => {
  console.log("Store", store);
  next();
});

/**
 * Prevent attackers sending requests with large request bodies
 * that can exhaust server memory and/or fill disk space
 */
app.use(express.json({ limit: "1kb" }));
app.use(express.urlencoded({ extended: false, limit: "1kb" }));

// Main route
app.get("/", (req, res) => {
  res.status(200).send("HI!");
});

/** Routes */
app.use("/api/goals", goalRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

// Server
const startServer = async () => {
  await mongoConnect();
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

startServer();

module.exports = app;
