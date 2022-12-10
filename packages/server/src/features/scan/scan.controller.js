const { getStatusCollection, getOutputStatusCollection, getCouncilStatusCol } = require("../../mongo");

async function getChainScanHeight(chain) {
  const statusCol = await getStatusCollection(chain);
  const outputStatusCol = await getOutputStatusCollection(chain)
  const councilStatusCol = await getCouncilStatusCol(chain);

  const output = await outputStatusCol.find({}).toArray();
  const income = await statusCol.find({}).toArray();
  const council = await councilStatusCol.find({}).toArray();

  const incomeScan = (income || []).find(item => item.name === 'income-scan');
  const outScan = (output || []).find(item => item.name === 'output-scan');
  const councilScan = (council || []).find(item => item.name === 'council-scan');
  return {
    income: incomeScan.height,
    output: outScan.value,
    council: councilScan.value,
  }
}

class ScanController {
  async getStatus(ctx) {
    const dot = await getChainScanHeight('polkadot');
    const ksm = await getChainScanHeight('kusama');
    ctx.body = {
      dot,
      ksm
    }
  }
}

module.exports = new ScanController();
