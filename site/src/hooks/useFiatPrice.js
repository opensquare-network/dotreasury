import { gql } from "@apollo/client";
import useDoTreasuryEcoLazyQuery from "./useDoTreasuryEcoLazyQuery";
import { find } from "lodash-es";
import { useEffect } from "react";
import { chainSelector } from "../store/reducers/chainSlice";
import { useSelector } from "react-redux";

const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      chain
      price
    }
  }
`;

const GET_PRICE = gql`
  query GetPrice($symbol: String!) {
    prices(symbol: $symbol) {
      price
      symbol
    }
  }
`;

export default function useFiatPrice() {
  const chain = useSelector(chainSelector);

  const [getTreasuries, { data, loading }] =
    useDoTreasuryEcoLazyQuery(GET_TREASURIES);

  useEffect(() => {
    getTreasuries();

    const intervalId = setInterval(() => {
      getTreasuries();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [getTreasuries]);

  const treasury = find(data?.treasuries, {
    chain,
  });

  return {
    price: treasury?.price,
    loading,
  };
}

export function useFiatPriceBySymbol(symbol) {
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
