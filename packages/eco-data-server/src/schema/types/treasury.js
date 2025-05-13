const treasuryData = /* GraphQL */ `
  type BalanceDetail {
    token: String!
    balance: String
    decimals: Int
    price: Float
    priceUpdateAt: Float
  }

  type TreasuryData {
    chain: String!
    balance: String
    balances: [BalanceDetail]
    balanceUpdateAt: Float
    price: Float
    priceUpdateAt: Float
  }
`;

module.exports = {
  treasuryData,
};
