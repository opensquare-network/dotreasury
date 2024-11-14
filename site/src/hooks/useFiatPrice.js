import { gql } from "@apollo/client";
import useDoTreasuryEcoLazyQuery from "./useDoTreasuryEcoLazyQuery";
import { find } from "lodash-es";
import { useEffect } from "react";

const GET_TREASURIES = gql`
  query GetTreasuries($chain: String!) {
    treasuries(chain: $chain) {
      price
      chain
    }
  }
`;

export default function useFiatPrice(chain) {
  const [getTreasuries, { data, loading }] =
    useDoTreasuryEcoLazyQuery(GET_TREASURIES);

  useEffect(() => {
    getTreasuries({ variables: { chain } });

    const intervalId = setInterval(() => {
      getTreasuries({ variables: { chain } });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [getTreasuries, chain]);

  const treasury = find(data?.treasuries, {
    chain: chain,
  });

  return {
    price: treasury?.price,
    isLoading: loading,
  };
}
