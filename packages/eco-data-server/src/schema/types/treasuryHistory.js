const treasuryHistoryData = /* GraphQL */ `
  type TreasuryHistoryItemData {
    chain: String!
    date: Float
    balance: Float
    balances: [BalanceDetail]
    balanceUpdateAt: Float
  }
`;

module.exports = {
  treasuryHistoryData,
};
