require("dotenv").config();

const { beginScan } = require("./scan");
const { checkSpecs } = require("./chain/specs/check");
const { updateSpecs } = require("./chain/specs");
const { updateHeight } = require("./chain/latestHead");
const { disconnect } = require("@dotreasury/common");

async function main() {
  await updateHeight();
  await updateSpecs();
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
