const {
  getStatusCollection,
  getOutputStatusCollection,
  getCouncilStatusCol,
} = require("../../mongo");

async function getChainScanStatus() {
  const statusCol = await getStatusCollection();
  const outputStatusCol = await getOutputStatusCollection();
  const councilStatusCol = await getCouncilStatusCol();

  const output = await outputStatusCol.find({}).toArray();
  const income = await statusCol.find({}).toArray();
  const council = await councilStatusCol.find({}).toArray();

  const incomeScan = (income || []).find((item) => item.name === "income-scan");
  const outScan = (output || []).find((item) => item.name === "output-scan");
  const councilScan = (council || []).find(
    (item) => item.name === "council-scan",
  );
  return {
    income: incomeScan.height,
    output: outScan.value,
    council: councilScan.value,
  };
}

class ScanController {
  async getStatus(ctx) {
    const status = await getChainScanStatus();
    ctx.body = {
      status,
    };
  }
}

module.exports = new ScanController();
