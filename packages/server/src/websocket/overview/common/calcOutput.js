const { bigAdd } = require("../../../utils");
const { stringUpperFirst } = require("@polkadot/util");
const { addUsdtValue } = require("./utils");
const { bountyStatuses } = require("./constants");

async function calcOutput(
  proposals = [],
  tips = [],
  bounties = [],
  burntList = [],
  outputTransferList = [],
  chain,
  ) {
  const spentProposals = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Awarded"
  );
  const proposalSpent = spentProposals.reduce(
    (result, { value, symbolPrice }) => ({
      value: bigAdd(result.value, value),
      fiatValue: addUsdtValue(
        result.fiatValue,
        value,
        symbolPrice,
        chain
      ).toNumber(),
    }),
    { value: 0, fiatValue: 0 }
  );

  const tipSpent = tips.reduce((result, { state, medianValue, symbolPrice }) => {
    if (state.state !== "TipClosed") {
      return result;
    }

    const eventValue = state.data[2];
    const value = eventValue || medianValue || 0;
    return {
      value: bigAdd(result.value, value),
      fiatValue: addUsdtValue(
        result.fiatValue,
        value,
        symbolPrice,
        chain
      ).toNumber(),
    };
  }, { value: 0, fiatValue: 0 });

  const bountySpent = bounties.reduce((result, { meta: { status, value }, symbolPrice }) => {
    const statusKey = stringUpperFirst(Object.keys(status)[0]);

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    if (index < 2) {
      return result;
    }

    return {
      value: bigAdd(result.value, value),
      fiatValue: addUsdtValue(
        result.fiatValue,
        value,
        symbolPrice,
        chain
      ).toNumber(),
    };
  }, { value: 0, fiatValue: 0 });

  const burntTotal = burntList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  const transferTotal = outputTransferList.reduce((result, { balance }) => {
    return bigAdd(result, balance);
  }, 0);

  const emptyTrackSpent = { count: 0, value: 0, fiatValue: 0 };
  const referendaSpent = [
    "treasurer",
    "small_tipper",
    "big_tipper",
    "small_spender",
    "medium_spender",
    "big_spender"
  ].reduce((result, curr) => {
    result[curr] = { ...emptyTrackSpent };
    return result;
  }, {});

  const gov2Proposals = proposals.filter(p => p.isByGov2);
  for (const proposal of gov2Proposals) {
    const { track: { name: trackName } = {}, value, symbolPrice = 0, } = proposal;
    if (!trackName) {
      continue;
    }

    const trackSpent = referendaSpent[trackName] || { ...emptyTrackSpent };
    referendaSpent[trackName] = {
      value: bigAdd(trackSpent.value, value),
      fiatValue: addUsdtValue(trackSpent.fiatValue, value, symbolPrice, chain).toNumber(),
      count: (trackSpent.count || 0) + 1,
    }
  }

  return {
    proposal: proposalSpent,
    tip: tipSpent,
    bounty: bountySpent,
    burnt: { value: burntTotal },
    transfer: { value: transferTotal },
    referendaSpent,
  };
}

module.exports = {
  calcOutput,
};
