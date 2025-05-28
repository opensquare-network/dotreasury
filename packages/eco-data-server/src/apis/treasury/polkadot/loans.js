const loansCentrifugeUsdcBalance = 1500000000000;
const loansBifrostDotBalance = 0;
const loansPendulumDotBalance = 500000000000000;
const loansHydrationDotBalance = 10000000000000000;

async function getLoansBifrostDotBalanceByBlockHeight(blockHeight) {
  // if (blockHeight > ?) {
  //   return 100000000000000000;
  // }

  if (blockHeight > 6910429) {
    return 0;
  }

  return 5000000000000000;
}

module.exports = {
  loansCentrifugeUsdcBalance,
  loansBifrostDotBalance,
  loansPendulumDotBalance,
  loansHydrationDotBalance,
  getLoansBifrostDotBalanceByBlockHeight,
};
