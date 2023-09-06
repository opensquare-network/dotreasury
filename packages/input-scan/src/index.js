require("dotenv").config();
const { beginScan } = require("./scan");
const {
  chain: { subscribeChainHeight, updateSpecs, checkSpecs },
  env: { isUseMetaDb },
} = require("@osn/scan-common");
const { closeDb } = require("./mongo/data");

async function main() {
  await subscribeChainHeight();
  if (isUseMetaDb()) {
    await updateSpecs();
    checkSpecs();
  }

  await beginScan();
}

main()
  .then(async () => {
    await closeDb();
  })
  .catch(console.error);
