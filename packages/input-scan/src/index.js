require("dotenv").config();
const { getNextScanHeight } = require("./mongo/scanHeight");
const { beginScan } = require("./scan");
const { updateSpecs } = require("./chain/specs");
const { updateHeight } = require("./chain/latestHead");
const { closeDb } = require("./mongo/data");

async function main() {
  let scanHeight = await getNextScanHeight();

  await updateHeight();
  await updateSpecs(scanHeight);

  await beginScan();
}

main().then(async () => {
  await closeDb()
}).catch(console.error)
