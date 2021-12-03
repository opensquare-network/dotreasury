require("dotenv").config();
const { beginScan } = require("./scan");
const { chainHeight: { subscribeChainHeight }, specs: { updateSpecs } } = require("@dotreasury/common");
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
