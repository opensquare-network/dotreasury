const { getDb } = require("./getDb");

const inputDbName =
  process.env.MONGO_DB_POLKADOT_INPUT_NAME || "dotreasury-input";

const outputDbName =
  process.env.MONGO_DB_POLKADOT_OUTPUT_NAME || "dotreasury-output";

const councilDbName =
  process.env.MONGO_DB_POLKADOT_COUNCIL_NAME || "dotreasury-council";

module.exports = getDb({ inputDbName, outputDbName, councilDbName });
