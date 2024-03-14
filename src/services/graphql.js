const { loadFilesSync } = require("@graphql-tools/load-files");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { graphqlHTTP } = require("express-graphql");

const typesArray = loadFilesSync("../collections/**/*", {
  extensions: ["graphql"],
});

const resolversArray = loadFilesSync("../collections/**/*", {
  extensions: [".resolvers.js"],
});

const graphqlSchema = makeExecutableSchema({
  typeDefs: typesArray,
  resolvers: resolversArray,
});

const useGraphQl = graphqlHTTP({ schema: graphqlSchema, graphiql: true });

module.exports = { graphqlSchema, useGraphQl };
