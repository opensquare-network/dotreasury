const { treasuryData } = require("./treasury");
const { treasuryHistoryData } = require("./treasuryHistory");
const { tokenPriceData } = require("./token");
const { priceHistoryData } = require("./priceHistory");
const { queries } = require("./query");

const typeDefs = [
  treasuryData,
  treasuryHistoryData,
  tokenPriceData,
  priceHistoryData,
  queries,
];

module.exports = {
  typeDefs,
};
