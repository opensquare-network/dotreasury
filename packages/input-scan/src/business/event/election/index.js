const { utils: { bigAdd } } = require("@dotreasury/common");
const { handleNewTerm } = require("./newTerm");
const { handleSeatHolderSlash } = require("./seatHolderSlash");
const { handleCandidateSlash } = require("./candidateSlash");

async function handleElection(event, indexer, blockEvents) {
  const candidate = await handleCandidateSlash(...arguments);
  const seatHolder = await handleSeatHolderSlash(...arguments);
  const newTerm = await handleNewTerm(...arguments);

  let result = 0;
  if (candidate) {
    result = bigAdd(result, candidate.balance);
  }

  if (seatHolder) {
    result = bigAdd(result, seatHolder.balance);
  }

  if (newTerm) {
    result = bigAdd(result, newTerm.balance);
  }

  return result;
}

module.exports = {
  handleElection,
}
