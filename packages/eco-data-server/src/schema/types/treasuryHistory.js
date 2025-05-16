const treasuryHistoryData = /* GraphQL */ `
  type TreasuryHistoryItemData {
    chain: String!
    date: Float
    balance: String
    balanceUpdateAt: Float
    price: Float
    priceUpdateAt: Float
  }
`;

module.exports = {
  treasuryHistoryData,
};
