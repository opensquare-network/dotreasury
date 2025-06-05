const queries = /* GraphQL */ `
  type Query {
    treasuries(chain: String): [TreasuryData]!
    treasuryHistory(chain: String): [TreasuryHistoryItemData]!
    prices(symbol: String): [TokenPriceData]!
  }
`;

module.exports = {
  queries,
};
