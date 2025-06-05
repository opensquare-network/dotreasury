const { normalizeBalancesItem } = require("../../mongo");

async function normalizeTreasury(treasury) {
  const balances =
    treasury.balances &&
    (await Promise.all(
      treasury.balances.map((item) => normalizeBalancesItem(item)),
    ));

  return {
    ...treasury,
    balances,
    balanceUpdateAt: treasury.balanceUpdateAt.getTime(),
  };
}

module.exports = {
  normalizeTreasury,
};
