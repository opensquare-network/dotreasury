const treasuryData = /* GraphQL */ `
  type TreasuryData {
    chain: String!
    balance: String
    balanceUpdateAt: Float
    price: Float
    priceUpdateAt: Float
  }
`;

module.exports = {
  treasuryData,
};
