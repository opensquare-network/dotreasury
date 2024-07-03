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
const { startAssetHubJob } = require("./business/assethub/query");

async function main() {
  await subscribeChainHeight();
  if (isUseMetaDb()) {
    await updateSpecs();
    checkSpecs();
  }
  startAssetHubJob();

  await beginScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
