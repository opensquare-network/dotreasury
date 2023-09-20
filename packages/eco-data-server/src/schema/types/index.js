const { treasuryData } = require("./treasury");
const { queries } = require("./query");

const typeDefs = [
  treasuryData,
  queries,
];

module.exports = {
  typeDefs,
};
