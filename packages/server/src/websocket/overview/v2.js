const {
  getProposalCollection,
  getBountyCollection,
  getTipCollection,
  getBurntCollection,
  getStatusCollection,
  getOutputTransferCollection,
  getReferendaReferendumCollection,
} = require("../../mongo");
const { setOverviewV2, getOverviewV2 } = require("./../store");
const { overviewRoomV2, OVERVIEW_FEED_INTERVAL } = require("../constants");
const util = require("util");
const { calcBestTipProposers } = require("./common/calcBestTipProposers");
const { calcBestProposalBeneficiary } = require("./common/calcBestProposalBeneficiary");
const { getLatestSymbolPrice } = require("./common/getLatestSymbolPrice");
const { calcToBeAwarded } = require("./common/calcToBeAwarded");
const { calcOutput } = require("./common/calcOutput");
const { calcCount } = require("./common/calcCount");

async function feedOverviewV2(chain, io) {
  try {
    const oldStoreOverview = getOverviewV2(chain);
    const overview = await calcOverview(chain);

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverviewV2(chain, overview);
    io.to(`${chain}:${overviewRoomV2}`).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverviewV2.bind(null, chain, io), OVERVIEW_FEED_INTERVAL);
  }
}

async function calcOverview(chain) {
  const proposalCol = await getProposalCollection(chain);
  const proposals = await proposalCol
    .find({}, { projection: { value: 1, beneficiary: 1, meta: 1, state: 1, isByGov2: 1, track: 1, _id: 0 } })
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

  const referendaCol = await getReferendaReferendumCollection(chain);
  const referendaList = await referendaCol
    .find({})
    .toArray();

  const count = await calcCount(
    proposals,
    tips,
    bounties,
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
    chain,
  );
  const toBeAwarded = await calcToBeAwarded(
    proposals,
    bounties,
  );
  const bestProposalBeneficiaries = calcBestProposalBeneficiary(
    chain,
    proposals
  );
  const bestTipFinders = calcBestTipProposers(chain, tips);

  const statusCol = await getStatusCollection(chain);
  const incomeScan = await statusCol.findOne({ name: "income-scan" });

  const latestSymbolPrice = await getLatestSymbolPrice(chain);

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
