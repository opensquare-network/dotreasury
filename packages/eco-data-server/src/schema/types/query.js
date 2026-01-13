const queries = /* GraphQL */ `
  type Query {
    treasuries(chain: String): [TreasuryData]!
    treasuryHistory(chain: String): [TreasuryHistoryItemData]!
    prices(symbol: String): [TokenPriceData]!
    priceHistory(symbol: String!, timestamp: Float!): PriceHistoryData!
  }
`;

module.exports = {
  queries,
};
