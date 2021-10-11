require("dotenv").config();
const { beginScan } = require("./scan");
const { updateSpecs } = require("./chain/specs");
const { updateHeight } = require("./chain/latestHead");
const { closeDb } = require("./mongo/data");

async function main() {
  await updateHeight();
  await updateSpecs();

  await beginScan();
}

main().then(async () => {
  await closeDb()
}).catch(console.error)
