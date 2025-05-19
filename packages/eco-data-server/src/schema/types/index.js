const { treasuryData } = require("./treasury");
const { treasuryHistoryData } = require("./treasuryHistory");
const { tokenPriceData } = require("./token");
const { queries } = require("./query");

const typeDefs = [treasuryData, treasuryHistoryData, tokenPriceData, queries];

module.exports = {
  typeDefs,
};
