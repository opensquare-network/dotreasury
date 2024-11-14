const dotenv = require("dotenv");
dotenv.config();

const { syncTreasurySpends } = require("./sync-spends");
const { syncTreasuryProposals } = require("./sync-proposals");
const { syncTips } = require("./sync-tips");

async function main() {
  await syncTreasurySpends();
  await syncTreasuryProposals();
  await syncTips();
}

main()
  .catch(console.error)
  .finally(() => process.exit());
