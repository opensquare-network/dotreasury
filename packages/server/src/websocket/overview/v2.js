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
} = require("../../mongo");
const { setOverviewV2, getOverviewV2 } = require("./../store");
const { overviewRoomV2, OVERVIEW_FEED_INTERVAL } = require("../constants");
const util = require("util");
const { calcBestTipProposers } = require("./common/calcBestTipProposers");
const {
  calcBestProposalBeneficiary,
} = require("./common/calcBestProposalBeneficiary");
const { getLatestSymbolPrice } = require("./common/getLatestSymbolPrice");
const { calcToBeAwarded } = require("./common/calcToBeAwarded");
const { calcOutput } = require("./common/calcOutput");
const { calcCount } = require("./common/calcCount");

async function feedOverviewV2(io) {
  try {
    const oldStoreOverview = getOverviewV2();
    const overview = await calcOverview();

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverviewV2(overview);

    io.to(overviewRoomV2).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverviewV2.bind(null, io), OVERVIEW_FEED_INTERVAL);
  }
}

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

  const count = await calcCount(
    proposals,
    failedProposals,
    tips,
    bounties,
    childBounties,
    burntList,
    outputTransferList,
    referendaList,
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

module.exports = {
  feedOverviewV2,
};
