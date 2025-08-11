const loansBifrostDotBalance = 10000000000000000;
const loansPendulumDotBalance = 500000000000000;
const loansHydrationDotBalance = 10000000000000000;

function getLoansBifrostDotBalanceByTimestamp(timestamp) {
  // https://polkadot.subsquare.io/treasury/proposals/1020?tab=timeline
  if (timestamp > 1748817708000) {
    return loansBifrostDotBalance;
  }

  // https://bifrost.subsquare.io/referenda/110?tab=timeline
  if (timestamp > 1742984040000) {
    return 0;
  }

  return 5000000000000000;
}

module.exports = {
  loansBifrostDotBalance,
  loansPendulumDotBalance,
  loansHydrationDotBalance,
  getLoansBifrostDotBalanceByTimestamp,
};
