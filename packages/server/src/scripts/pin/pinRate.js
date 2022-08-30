const { getRateCollection } = require("../../mongo-admin");
const ipfsService = require("../../services/ipfs.service");

async function pinRates(pinAll = false) {
  const rateCol = await getRateCollection();
  const rates = await rateCol.find(pinAll ? {} : { pinHash: null }).toArray();
  for (const rate of rates) {
    let pinHash = undefined;

    try {
      const msg = JSON.stringify(rate.data);
      const added = await ipfsService.ipfsAdd({
        msg,
        address: rate.address,
        signature: rate.signature,
        version: "1",
      });
      pinHash = added?.cid?.toV1().toString();
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

module.exports = {
  pinRates,
};
