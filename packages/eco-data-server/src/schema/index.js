const { makeExecutableSchema } = require("@graphql-tools/schema");
const { typeDefs } = require("./types");
const resolverFunctions = require("./resolvers");

const resolvers = {
  Query: {
    ...resolverFunctions,
  },
};

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs,
});

module.exports = {
  schema,
};
