const { hello } = require("./hello");
const { treasuryData } = require("./treasury");
const { queries } = require("./query");

const typeDefs = [
  hello,
  treasuryData,
  queries,
];

module.exports = {
  typeDefs,
};
