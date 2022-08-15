require("dotenv").config();

const { beginScan } = require("./scan");
const {
  chain: {
    disconnect,
    subscribeChainHeight,
    updateSpecs, checkSpecs,
  },
  env: { isUseMetaDb },
} = require("@osn/scan-common");

async function main() {
  await subscribeChainHeight();
  if (isUseMetaDb()) {
    await updateSpecs();
    checkSpecs();
  }

  await beginScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
