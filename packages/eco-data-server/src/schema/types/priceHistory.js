const priceHistoryData = /* GraphQL */ `
  type PriceHistoryData {
    symbol: String!
    timestamp: Float!
    price: Float
  }
`;

module.exports = {
  priceHistoryData,
};
