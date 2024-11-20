const queries = /* GraphQL */ `
  type Query {
    treasuries(chain: String): [TreasuryData]!
    prices(symbol: String): [TokenPriceData]!
  }
`;

module.exports = {
  queries,
}
