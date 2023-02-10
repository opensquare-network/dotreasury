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
  referendaList = [],
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

  const referendaSpent = {};
  for (const item of referendaList) {
    if (item.state.name !== "Executed") {
      continue;
    }
    const trackSpent = referendaSpent[item.trackInfo.name] || { count: 0, value: 0, fiatValue: 0 };
    referendaSpent[item.trackInfo.name] = {
      value: bigAdd(trackSpent.value, item.amount),
      fiatValue: addUsdtValue(
          trackSpent.fiatValue,
          item.amount,
          item.symbolPrice,
          chain
        ).toNumber(),
      count: trackSpent.count + 1,
    };
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
