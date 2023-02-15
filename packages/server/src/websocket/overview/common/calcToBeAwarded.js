const { bigAdd } = require("../../../utils");

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

  const bountyToBeAwarded = bounties.reduce((result, { meta: { value } = {}, state: { state } = {} }) => {
    return "Approved" === state ? bigAdd(result, value) : result;
  }, 0);

  return {
    total: bigAdd(proposalToBeAwarded, bountyToBeAwarded)
  };
}

module.exports = {
  calcToBeAwarded,
};
