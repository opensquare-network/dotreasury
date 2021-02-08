const {
  Modules,
  DemocracyEvents,
  CouncilMethods,
  DemocracyMethods,
} = require("../../utils/constants");
const { getApi } = require("../../api");
const { getCall } = require("../../utils/call");
const { incomeLogger } = require("../../utils");

function handleDemocracyBacklistedOrPreimageInvalid(
  event,
  sort,
  allBlockEvents,
  blockIndexer
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1 || phase.isNull) {
    return;
  }

  const nextEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.Democracy ||
    ![DemocracyEvents.Blacklisted, DemocracyEvents.PreimageInvalid].includes(
      method
    )
  ) {
    return;
  }

  const nextEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const key =
    DemocracyEvents.Blacklisted === method
      ? "backListedEventData"
      : "preimageInvalidEventData";

  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    [key]: nextEventData,
  };
  incomeLogger.info(
    `democracy backlisted or preimageInvalid slash detected`,
    data
  );

  return data;
}

async function handleDemocracyCancelProposalSlash(
  event,
  sort,
  allBlockEvents,
  extrinsicIndexer,
  extrinsic
) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (phase.isNull) {
    return;
  }

  const meta = extrinsic.method.meta.toJSON();
  if (
    extrinsic.method.section !== Modules.Council ||
    meta.name !== CouncilMethods.close
  ) {
    return;
  }

  const api = await getApi();
  const proposalHash = extrinsic.method.args[0].toJSON();
  const blockHash = await api.rpc.chain.getBlockHash(
    extrinsicIndexer.blockHeight - 1
  );
  const proposal = await api.query.council.proposalOf.at(
    blockHash,
    proposalHash
  );

  const call = await getCall(blockHash, proposal.toHex());

  if (
    Modules.Democracy !== call.section &&
    DemocracyMethods.cancelProposal !== call.method
  ) {
    return;
  }

  const propIndex = call.args[0].toJSON();

  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: extrinsicIndexer,
    section: Modules.Democracy,
    method: call.method,
    balance,
    treasuryDepositEventData,
    canceledProposalIndex: propIndex,
  };
  incomeLogger.info(`democracy cancel proposal slash detected`, data);
  return data;
}

module.exports = {
  handleDemocracyBacklistedOrPreimageInvalid,
  handleDemocracyCancelProposalSlash,
};
