// Node
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const https = require("https");
// 3rd party
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
// Services
const { mongoConnect, getSessionData } = require("./services/mongo");
// Route
const goalRouter = require("./routes/goals");
const userRouter = require("./routes/users");

const typesArray = loadFilesSync(path.join(__dirname, "**/*.graphql"));
const resolversArray = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

async function startServer() {
  await mongoConnect();
  await getSessionData();
  dotenv.config();
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  // Access for Angular app
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );

  // Security realted middleware!!
  // app.use(helmet());
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
  app.use(express.urlencoded({ extended: false, limit: "10kb" }));
  app.use(express.json({ limit: "10kb" }));

  app.use("/graphql", expressMiddleware(server));
  /** Routes */
  app.use("/api/goals", goalRouter);
  app.use("/api/users", userRouter);

  // Enable app to open Apollo client (the postman style one) on https localhost
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            "data:",
            "apollo-server-landing-page.cdn.apollographql.com",
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            "apollo-server-landing-page.cdn.apollographql.com",
          ],
          frameSrc: [`'self'`, "sandbox.embed.apollographql.com"],
        },
      },
    })
  );

  https
    .createServer(
      {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.pem"),
      },
      app
    )
    .listen(PORT, () => console.log(`Server started on port ${PORT}*`));
}

startServer();
