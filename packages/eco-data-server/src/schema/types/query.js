const queries = /* GraphQL */ `
  type Query {
    treasuries(chain: String): [TreasuryData]!
  }
`;

module.exports = {
  queries,
}
