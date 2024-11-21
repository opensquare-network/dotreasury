import { gql } from "@apollo/client";
import useDoTreasuryEcoLazyQuery from "./useDoTreasuryEcoLazyQuery";
import { find } from "lodash-es";
import { useEffect } from "react";

const GET_PRICE = gql`
  query GetPrice($symbol: String!) {
    prices(symbol: $symbol) {
      price
      symbol
    }
  }
`;

export default function useFiatPrice(symbol) {
  const [getPrice, { data, loading }] = useDoTreasuryEcoLazyQuery(GET_PRICE);

  useEffect(() => {
    getPrice({ variables: { symbol } });

    const intervalId = setInterval(() => {
      getPrice({ variables: { symbol } });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [getPrice, symbol]);

  const price = find(data?.prices, {
    symbol,
  });

  return {
    price: price?.price ?? 0,
    isLoading: loading,
  };
}
