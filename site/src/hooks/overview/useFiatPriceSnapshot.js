import { gql } from "@apollo/client";
import useDoTreasuryEcoLazyQuery from "../useDoTreasuryEcoLazyQuery";
import { useEffect } from "react";
import { find } from "lodash-es";
import { currentChain } from "../../utils/chains";

const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      chain
      price
    }
  }
`;

const CHAIN_VALUE_TREASURY_MAP = {
  "bifrost-polkadot": "bifrost",
  collectives: "polkadot",
};

export default function useFiatPriceSnapshot() {
  const [getTreasuries, { data, loading }] =
    useDoTreasuryEcoLazyQuery(GET_TREASURIES);

  useEffect(() => {
    getTreasuries();
  }, [getTreasuries]);

  const treasury = find(data?.treasuries, {
    chain: CHAIN_VALUE_TREASURY_MAP[currentChain] || currentChain,
  });

  return {
    price: treasury?.price,
    loading,
  };
}
