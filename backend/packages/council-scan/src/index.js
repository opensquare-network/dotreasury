require("dotenv").config();

const {
  chain: {
    disconnect,
    subscribeChainHeight,
    updateSpecs,
    checkSpecs,
  },
  env: {
    isUseMetaDb,
  }
} = require("@osn/scan-common");
const { closeDb } = require("./mongo");
const { beginScan } = require("./scan");

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
  await closeDb();
}
