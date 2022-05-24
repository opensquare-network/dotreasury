require("dotenv").config();
const { beginScan } = require("./scan");
const {
  chain: { subscribeChainHeight, updateSpecs },
} = require("@osn/scan-common");
const { closeDb } = require("./mongo/data");

async function main() {
  await subscribeChainHeight();
  await updateSpecs();

  await beginScan();
}

main()
  .then(async () => {
    await closeDb();
  })
  .catch(console.error);
