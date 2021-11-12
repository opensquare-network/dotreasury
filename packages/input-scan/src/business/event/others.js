const { getOthersIncomeCollection } = require("../../mongo/data");
const { gt } = require("../../utils");
const tooMuchGas = 0.1 * Math.pow(10, 12);

async function handleOthers(event, indexer) {
  const balance = event.data[0].toString();

  const obj = {
    indexer,
    balance,
  }

  if (gt(balance, tooMuchGas)) {
    const col = await getOthersIncomeCollection();
    await col.insertOne(obj);
  }

  return obj;
}

module.exports = {
  handleOthers,
}
