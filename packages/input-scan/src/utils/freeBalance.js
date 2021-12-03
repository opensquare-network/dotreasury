const { findBlockApi } = require("@dotreasury/common");

const TreasuryAccount = "F3opxRbN5ZbjJNU511Kj2TLuzFcDq9BGduA9TgiECafpg29";

async function getTreasuryBalanceV2(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  if (blockApi.query.system?.account) {
    const accountInfo = await blockApi.query.system.account(TreasuryAccount);
    return accountInfo.data.free.toString();
  }

  if (blockApi.query.balances.freeBalance) {
    const rawBalance = await blockApi.query.balances.freeBalance(TreasuryAccount);
    if (rawBalance) {
      return rawBalance.toString()
    }
  }

  return null;
}

module.exports = {
  getTreasuryBalanceV2,
};
