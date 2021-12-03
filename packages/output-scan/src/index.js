require("dotenv").config();

const { beginScan } = require("./scan");
const {
  disconnect, chainHeight: { subscribeChainHeight },
  specs: { updateSpecs, checkSpecs }
} = require("@dotreasury/common");

async function main() {
  await subscribeChainHeight();
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
