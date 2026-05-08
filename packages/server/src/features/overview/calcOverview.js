const {
  getProposalCollection,
  getFailedProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getStatusCollection,
  getOutputTransferCollection,
  getReferendaReferendumCollection,
  getChildBountyCollection,
  getSubsquareTreasurySpendCollection,
} = require("../../mongo");
const { calcBestTipProposers } = require("./common/calcBestTipProposers");
const {
  calcBestProposalBeneficiary,
} = require("./common/calcBestProposalBeneficiary");
const { getLatestSymbolPrice } = require("./common/getLatestSymbolPrice");
const { calcToBeAwarded } = require("./common/calcToBeAwarded");
const { calcOutput } = require("./common/calcOutput");
const { calcCount } = require("./common/calcCount");

async function calcOverview() {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol
    .find(
      {},
      {
        projection: {
          value: 1,
          beneficiary: 1,
          meta: 1,
          symbolPrice: 1,
          state: 1,
          isByGov2: 1,
          track: 1,
          _id: 0,
        },
      },
    )
    .toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol
    .find(
      {},
      {
        projection: {
          finder: 1,
          medianValue: 1,
          state: 1,
          symbolPrice: 1,
          _id: 0,
        },
      },
    )
    .toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol
    .find({}, { projection: { meta: 1, state: 1, symbolPrice: 1, _id: 0 } })
    .toArray();

  const childBountyCol = await getChildBountyCollection();
  const childBounties = await childBountyCol
    .find({}, { meta: 1, state: 1 })
    .toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol
    .find({}, { projection: { balance: 1 }, _id: 0 })
    .toArray();

  const outputTransferCol = await getOutputTransferCollection();
  const outputTransferList = await outputTransferCol
    .find({}, { projection: { balance: 1 }, _id: 0 })
    .toArray();

  const referendaCol = await getReferendaReferendumCollection();
  const referendaList = await referendaCol.find({}).toArray();

  const failedProposalCol = await getFailedProposalCollection();
  const failedProposals = await failedProposalCol.find({}).toArray();

  const subsquareTreasurySpendCol = await getSubsquareTreasurySpendCollection();
  const subsquareTreasurySpends = await subsquareTreasurySpendCol
    .find({})
    .toArray();

  const count = await calcCount(
    proposals,
    failedProposals,
    tips,
    bounties,
    childBounties,
    burntList,
    outputTransferList,
    referendaList,
    subsquareTreasurySpends,
  );
  const output = await calcOutput(
    proposals,
    tips,
    bounties,
    burntList,
    outputTransferList,
  );
  const toBeAwarded = await calcToBeAwarded(proposals, bounties);
  const bestProposalBeneficiaries = calcBestProposalBeneficiary(proposals);
  const bestTipFinders = calcBestTipProposers(tips);

  const statusCol = await getStatusCollection();
  const incomeScan = await statusCol.findOne({ name: "income-scan" });

  const latestSymbolPrice = await getLatestSymbolPrice();

  return {
    count,
    spent: output,
    output,
    toBeAwarded,
    latestSymbolPrice,
    bestProposalBeneficiaries,
    bestTipFinders,
    income: incomeScan?.seats || {
      inflation: 0,
      slash: 0,
      transfer: 0,
      others: 0,
      slashSeats: {
        treasury: 0,
        staking: 0,
        democracy: 0,
        electionsPhragmen: 0,
        identity: 0,
        referenda: 0,
        fellowshipReferenda: 0,
      },
    },
  };
}

const CACHE_TTL_MS = 30 * 1000;
let cachedOverview = null;
let cacheTimestamp = 0;

async function getCachedOverview() {
  const now = Date.now();
  if (!cachedOverview || now - cacheTimestamp > CACHE_TTL_MS) {
    cachedOverview = await calcOverview();
    cacheTimestamp = now;
  }
  return cachedOverview;
}

module.exports = { calcOverview, getCachedOverview };
