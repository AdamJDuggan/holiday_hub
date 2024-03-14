"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Node
const fs = require("fs");
const path = require("path");
const https = require("https");
const cors = require("cors");
// 3rd party
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { graphqlHTTP } = require("express-graphql");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
// Services
const { mongoConnect, getSessionData } = require("./src/services/mongo");
// Routes
const goalRouter = require("./src/collections/goals/route");
const userRouter = require("./src/collections/users/route");
/**
 * Consts --------------------------
 */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DEV = process.env.NODE_ENV === "development" ? false : true;
const app = express();
/**
 * Config --------------------------
 */
dotenv.config();
/**
 * Middleware --------------------------
 */
app.use(cors({
    origin: process.env.CLIENT_URL,
}));
// Secure headers
app.use(helmet({
    // Needed to run graphql palyground in development
    contentSecurityPolicy: DEV,
    crossOriginEmbedderPolicy: DEV,
}));
// Access session cookies in requests
app.use(cookieParser());
// Memory cache for session
app.use(session({
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
}));
// Prevent attackers sending requests with large request bodies
app.use(express.urlencoded({ extended: false, limit: "1kb" }));
app.use(express.json({ limit: "1kb" }));
/**
 * GraphQL ----------------------------
 */
const typesArray = loadFilesSync("./src/collections/**/*", {
    extensions: ["graphql"],
});
const resolversArray = loadFilesSync("./src/collections/**/*", {
    extensions: [".resolvers.js"],
});
const graphqlSchema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
});
const useGraphQl = graphqlHTTP({ schema: graphqlSchema, graphiql: true });
app.use("/graphql", useGraphQl);
/**
 * Routes --------------------------
 */
app.use("/api/goals", goalRouter);
app.use("/api/users", userRouter);
/**
 * Server --------------------------
 */
const startServer = async () => {
    await mongoConnect();
    await getSessionData();
    https
        .createServer({
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
    }, app)
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
