const treasuryHistoryData = /* GraphQL */ `
  type TreasuryHistoryItemData {
    chain: String!
    date: String!
    balance: String
    balanceUpdateAt: Float
    price: Float
    priceUpdateAt: Float
  }
`;

module.exports = {
  treasuryHistoryData,
};
