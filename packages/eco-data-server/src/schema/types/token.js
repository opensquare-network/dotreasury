const tokenPriceData = /* GraphQL */ `
  type TokenPriceData {
    symbol: String!
    price: Float
    priceUpdateAt: Float
    source: String
  }
`;

module.exports = {
  tokenPriceData,
}
