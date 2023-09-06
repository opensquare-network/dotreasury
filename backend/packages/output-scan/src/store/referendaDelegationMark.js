const delegationMap = {};

function setReferendaDelegationMark(height) {
  delegationMap[height] = true;
}

function clearReferendaDelegationMark(height) {
  delete delegationMap[height];
}

function hasReferendaDelegationMark(height) {
  return delegationMap[height];
}

module.exports = {
  setReferendaDelegationMark,
  clearReferendaDelegationMark,
  hasReferendaDelegationMark,
}
