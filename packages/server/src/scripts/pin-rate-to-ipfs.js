const dotenv = require("dotenv");
dotenv.config();

const { getRateCollection } = require("../mongo-admin");
const ipfsService = require("../services/ipfs.service");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function startPin() {
  const rateCol = await getRateCollection();
  const rates = await rateCol.find({ pinHash: null }).toArray();
  for (const rate of rates) {
    let pinHash = undefined;

    try {
      const msg = JSON.stringify(rate.data);
      const pinResult = await ipfsService.pinJsonToIpfs({
        msg,
        address: rate.address,
        signature: rate.signature,
        version: "1",
      });
      pinHash = pinResult.PinHash;
      console.log(`Pin hash: ${pinHash}`);
    } catch (e) {
      console.error(e);
    }

    if (pinHash) {
      await rateCol.updateOne({ _id: rate._id }, { $set:{ pinHash } });
      console.log(`Save pin hash to: ${rate._id}`);
    }
  }
}

async function main() {
  while (true) {
    try {
      await startPin();
      console.log(`Last pin at:`, new Date());
    } catch (e) {
      console.error(e);
    }

    await sleep(30*1000);
  }
}

main();
