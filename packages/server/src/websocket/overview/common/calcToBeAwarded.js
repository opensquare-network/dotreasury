const { bigAdd } = require("../../../utils");
const { stringUpperFirst } = require("@polkadot/util");
const { bountyStatuses } = require("./constants");

function calcToBeAwarded(
  proposals = [],
  bounties = [],
) {
  const proposalToBeAwarded = proposals.filter(
    ({ state: { name, state } }) => (name || state) === "Approved"
  ).reduce(
    (result, { value }) => bigAdd(result, value),
    0
  );

  const bountyToBeAwarded = bounties.reduce((result, { meta: { status, value } }) => {
    const statusKey = stringUpperFirst(Object.keys(status)[0]);

    const index = bountyStatuses.findIndex((item) => item === statusKey);
    return index >= 1 && index < 6 ? bigAdd(result, value) : result;
  }, 0);

  return {
    total: bigAdd(proposalToBeAwarded, bountyToBeAwarded)
  };
}

module.exports = {
  calcToBeAwarded,
};
