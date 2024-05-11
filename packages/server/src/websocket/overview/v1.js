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
const { bigAdd } = require("../../utils");
const { setOverview, getOverview } = require("../store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("../constants");
const util = require("util");
const { stringUpperFirst } = require("@polkadot/util");
const { calcBestTipProposers } = require("./common/calcBestTipProposers");
const {
  calcBestProposalBeneficiary,
} = require("./common/calcBestProposalBeneficiary");
const { calcCount } = require("./common/calcCount");
const { bountyStatuses } = require("./common/constants");

async function feedOverview(io) {
  try {
    const oldStoreOverview = getOverview();
    const overview = await calcOverview();

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverview(overview);
    io.to(overviewRoom).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverview.bind(null, io), OVERVIEW_FEED_INTERVAL);
  }
}

async function calcOverview() {
  const proposalCol = await getProposalCollection();
  const proposals = await proposalCol
    .find({}, { value: 1, beneficiary: 1, meta: 1, state: 1 })
    .toArray();

  const tipCol = await getTipCollection();
  const tips = await tipCol
    .find({}, { finder: 1, medianValue: 1, state: 1 })
    .toArray();

  const bountyCol = await getBountyCollection();
  const bounties = await bountyCol.find({}, { meta: 1, state: 1 }).toArray();

  const childBountyCol = await getChildBountyCollection();
  const childBounties = await childBountyCol
    .find({}, { meta: 1, state: 1 })
    .toArray();

  const burntCol = await getBurntCollection();
  const burntList = await burntCol.find({}, { balance: 1 }).toArray();

  const outputTransferCol = await getOutputTransferCollection();
  const outputTransferList = await outputTransferCol
    .find({}, { balance: 1 })
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
  const bestProposalBeneficiaries = calcBestProposalBeneficiary(proposals);
  const bestTipFinders = calcBestTipProposers(tips);

  const statusCol = await getStatusCollection();
  const incomeScan = await statusCol.findOne({ name: "income-scan" });

  return {
    count,
    spent: output,
    output,
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

async function calcOutput(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outputTransferList = [],
) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded",
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0,
  );

  const tipSpent = tips.reduce((result, { state, medianValue }) => {
    if (state.state !== "TipClosed") {
      return result;
    }

    const eventValue = state.data[2];
    const value = eventValue || medianValue || 0;
    return bigAdd(result, value);
  }, 0);

  const bountySpent = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = stringUpperFirst(Object.keys(status)[0]);

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    return index >= 2 ? bigAdd(result, value) : result;
  }, 0);

  const burntTotal = burntList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  const transferTotal = outputTransferList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
    burnt: burntTotal,
    transfer: transferTotal,
  };
}

module.exports = {
  feedOverview,
};
