const {
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
} = require("../mongo");
const { bigAdd } = require("../utils");
const { setOverview, getOverview } = require("./store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("./constants");
const util = require("util");

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

  const count = await calcCount(proposals, tips, bounties);
  const spent = await calcSpent(proposals, tips, bounties);
  const bestProposalBeneficiaries = calcBestProposalBeneficiary(proposals);
  const bestTipFinders = calcBestTipProposers(tips);

  return { count, spent, bestProposalBeneficiaries, bestTipFinders };
}

async function calcCount(proposals = [], tips = [], bounties = []) {
  const unFinishedProposals = proposals.filter(
    ({ state: { name } }) => name !== "Awarded" && name !== "Rejected"
  );
  const proposal = {
    unFinished: unFinishedProposals.length,
    all: proposals.length,
  };

  const unFinishedTips = tips.filter(
    ({ state: { state } }) => !["TipClosed", "TipRetracted"].includes(state)
  );
  const tip = {
    unFinished: unFinishedTips.length,
    all: tips.length,
  };

  const unFinishedBounties = bounties.filter(({ meta: { status } }) => {
    const statusKey = Object.keys(status)[0];
    return !["BountyRejected", "BountyClaimed", "BountyCanceled"].includes(
      statusKey
    );
  });
  const bounty = {
    unFinished: unFinishedBounties.length,
    all: bounties.length,
  };

  return { proposal, tip, bounty };
}

const bountyStatuses = [
  "Proposed",
  "Approved",
  "Funded",
  "CuratorProposed",
  "Active",
  "PendingPayout",
];

async function calcSpent(proposals = [], tips = [], bounties = []) {
  const spentProposals = proposals.filter(
    ({ state: { name } }) => name === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );

  const tipSpent = tips.reduce((result, { state: { state }, medianValue }) => {
    if (state !== "TipClosed") {
      return result;
    }

    return bigAdd(result, medianValue);
  }, 0);

  const bountySpent = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = Object.keys(status)[0];

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    return index >= 2 ? bigAdd(result, value) : result;
  }, 0);

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
  };
}

function sortByValue(arr) {
  return arr.sort((a, b) => {
    return Number(b.value) - Number(a.value);
  });
}

function calcBestProposalBeneficiary(proposals = []) {
  const spentProposals = proposals.filter(
    ({ state: { name } }) => name === "Awarded"
  );
  const map = {};
  for (const { beneficiary, value } of spentProposals) {
    const perhaps = map[beneficiary];
    const proposalValue = perhaps ? bigAdd(perhaps.value, value) : value;
    const count = perhaps ? perhaps.count + 1 : 1;

    map[beneficiary] = { value: proposalValue, count };
  }

  const beneficiaries = Object.entries(map).map(
    ([beneficiary, { value, count }]) => {
      return {
        beneficiary,
        value,
        count,
      };
    }
  );

  return sortByValue(beneficiaries).slice(0, 10);
}

function calcBestTipProposers(tips = []) {
  const closedTips = tips.filter(
    ({ state: { state } }) => state === "TipClosed"
  );
  const map = {};
  for (const { finder, medianValue } of closedTips) {
    const perhaps = map[finder];
    const tipValue = perhaps ? bigAdd(perhaps.value, medianValue) : medianValue;
    const count = perhaps ? perhaps.count + 1 : 1;

    map[finder] = { value: tipValue, count };
  }

  const finders = Object.entries(map).map(([finder, { value, count }]) => {
    return {
      finder,
      value,
      count,
    };
  });

  return sortByValue(finders).slice(0, 10);
}

module.exports = {
  feedOverview,
};
