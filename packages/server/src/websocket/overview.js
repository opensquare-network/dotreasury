const {
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getStatusCollection,
  getOutputTransferCollection,
} = require("../mongo");
const { bigAdd } = require("../utils");
const { setOverview, getOverview } = require("./store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("./constants");
const util = require("util");
const BigNumber = require("bignumber.js");
const { stringUpperFirst } = require("@polkadot/util");

async function feedOverview(chain, io) {
  try {
    const oldStoreOverview = getOverview(chain);
    const overview = await calcOverview(chain);

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverview(chain, overview);
    io.to(`${chain}:${overviewRoom}`).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverview.bind(null, chain, io), OVERVIEW_FEED_INTERVAL);
  }
}

async function calcOverview(chain) {
  const proposalCol = await getProposalCollection(chain);
  const proposals = await proposalCol
    .find({}, { value: 1, beneficiary: 1, meta: 1, state: 1 })
    .toArray();

  const tipCol = await getTipCollection(chain);
  const tips = await tipCol
    .find({}, { finder: 1, medianValue: 1, state: 1 })
    .toArray();

  const bountyCol = await getBountyCollection(chain);
  const bounties = await bountyCol.find({}, { meta: 1, state: 1 }).toArray();

  const burntCol = await getBurntCollection(chain);
  const burntList = await burntCol.find({}, { balance: 1 }).toArray();

  const outputTransferCol = await getOutputTransferCollection(chain);
  const outputTransferList = await outputTransferCol
    .find({}, { balance: 1 })
    .toArray();

  const count = await calcCount(
    proposals,
    tips,
    bounties,
    burntList,
    outputTransferList
  );
  const output = await calcOutput(
    proposals,
    tips,
    bounties,
    burntList,
    outputTransferList
  );
  const bestProposalBeneficiaries = calcBestProposalBeneficiary(
    chain,
    proposals
  );
  const bestTipFinders = calcBestTipProposers(chain, tips);

  const statusCol = await getStatusCollection(chain);
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
      },
    },
  };
}

async function calcCount(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outputTransferList = []
) {
  const unFinishedProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) !== "Awarded" && (name || state) !== "Rejected"
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

  const unFinishedBounties = bounties.filter(
    ({ state: { name: stateName } }) => {
      return !["BountyRejected", "BountyClaimed", "BountyCanceled"].includes(
        stateName
      );
    }
  );

  const bounty = {
    unFinished: unFinishedBounties.length,
    all: bounties.length,
  };

  const burnt = {
    all: burntList.length,
  };

  const transfer = {
    all: outputTransferList.length,
  };

  return { proposal, tip, bounty, burnt, transfer };
}

const bountyStatuses = [
  "Proposed",
  "Approved",
  "Funded",
  "CuratorProposed",
  "Active",
  "PendingPayout",
];

async function calcOutput(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outputTransferList = []
) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value }) => bigAdd(result, value),
    0
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

function sortByValue(arr) {
  return arr.sort((a, b) => {
    return Number(b.fiatValue) - Number(a.fiatValue);
  });
}

function sortByCount(arr) {
  return arr.sort((a, b) => {
    return Number(b.count) - Number(a.count);
  });
}

function addUsdtValue(currUsdtValue, nextSymbolValue, symbolPrice, chain) {
  const nextUsdtValue = new BigNumber(nextSymbolValue)
    .div(Math.pow(10, chain === "kusama" ? 12 : 10))
    .multipliedBy(symbolPrice);
  return currUsdtValue ? nextUsdtValue.plus(currUsdtValue) : nextUsdtValue;
}

function calcBestProposalBeneficiary(chain, proposals = []) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const map = {};
  for (const { beneficiary, value, symbolPrice } of spentProposals) {
    const perhaps = map[beneficiary];
    const proposalValue = perhaps ? bigAdd(perhaps.value, value) : value;
    const proposalFiatValue = addUsdtValue(
      perhaps ? perhaps.fiatValue : 0,
      value,
      symbolPrice || 0,
      chain
    );
    const count = perhaps ? perhaps.count + 1 : 1;

    map[beneficiary] = {
      value: proposalValue,
      fiatValue: proposalFiatValue,
      count,
    };
  }

  const beneficiaries = Object.entries(map).map(
    ([beneficiary, { value, fiatValue, count }]) => {
      return {
        beneficiary,
        value,
        fiatValue,
        count,
      };
    }
  );

  return sortByValue(beneficiaries).slice(0, 10);
}

function calcBestTipProposers(chain, tips = []) {
  const closedTips = tips.filter(
    ({ state: { state } }) => state === "TipClosed"
  );
  const map = {};
  for (const { finder, medianValue, symbolPrice } of closedTips) {
    const tipMedianValue = medianValue || 0;
    const perhaps = map[finder];
    const tipValue = perhaps ? bigAdd(perhaps.value, tipMedianValue) : tipMedianValue;
    const tipFiatValue = addUsdtValue(
      perhaps ? perhaps.fiatValue : 0,
      tipMedianValue,
      symbolPrice || 0,
      chain
    );
    const count = perhaps ? perhaps.count + 1 : 1;

    map[finder] = { value: tipValue, fiatValue: tipFiatValue, count };
  }

  const finders = Object.entries(map).map(
    ([finder, { value, fiatValue, count }]) => {
      return {
        finder,
        value,
        fiatValue,
        count,
      };
    }
  );

  return sortByCount(finders).slice(0, 10);
}

module.exports = {
  feedOverview,
};
