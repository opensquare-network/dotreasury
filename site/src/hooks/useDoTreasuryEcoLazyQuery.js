import { ApolloClient, InMemoryCache, useLazyQuery } from "@apollo/client";

const doTreasuryEcoClient = new ApolloClient({
  uri: "https://eco-api.dotreasury.com/graphql",
  cache: new InMemoryCache(),
});

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useLazyQuery}
 */
export default function useDoTreasuryEcoLazyQuery(
  query,
  options = {},
  ...args
) {
  options.client = options.client || doTreasuryEcoClient;
  return useLazyQuery(query, options, ...args);
}
