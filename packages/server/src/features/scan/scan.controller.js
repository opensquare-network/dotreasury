const { getStatusCollection, getOutputStatusCollection } = require("../../mongo");

async function getChainScanHeight(chain) {
  const statusCol = await getStatusCollection(chain);
  const outputStatusCol = await getOutputStatusCollection(chain)
  const output = await outputStatusCol.find({}).toArray();
  const income = await statusCol.find({}).toArray();

  const incomeScan = (income || []).find(item => item.name === 'income-scan');
  const outScan = (output || []).find(item => item.name === 'output-scan');
  return {
    income: incomeScan.height,
    output: outScan.value,
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
