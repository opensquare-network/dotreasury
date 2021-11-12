require("dotenv").config();

const { getNextScanHeight } = require("./mongo/scanHeight");
const { beginScan } = require("./scan");
const { checkSpecs } = require("./chain/specs/check");
const { updateSpecs } = require("./chain/specs");
const { updateHeight } = require("./chain/latestHead");
const { disconnect } = require("./api");

async function main() {
  let scanHeight = await getNextScanHeight();

  await updateHeight();
  await updateSpecs(scanHeight);
  checkSpecs();

  await beginScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
