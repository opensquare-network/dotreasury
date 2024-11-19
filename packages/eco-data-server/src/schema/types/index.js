const { treasuryData } = require("./treasury");
const { tokenPriceData } = require("./token");
const { queries } = require("./query");

const typeDefs = [
  treasuryData,
  tokenPriceData,
  queries,
];

module.exports = {
  typeDefs,
};
