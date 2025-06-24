import { useEffect, useMemo } from "react";
import { gql } from "@apollo/client";
import useDoTreasuryEcoLazyQuery from "../../hooks/useDoTreasuryEcoLazyQuery";

const GET_TREASURY_HISTORY = gql`
  query MyQuery {
    treasuryHistory(chain: "polkadot") {
      balance
      balanceUpdateAt
      chain
      date
      balances {
        balance
        decimals
        price
        priceUpdateAt
        token
      }
    }
  }
`;

export default function useTreasuryHistoryData() {
  const [getTreasuryHistory, { loading, data: result }] =
    useDoTreasuryEcoLazyQuery(GET_TREASURY_HISTORY);

  useEffect(() => {
    getTreasuryHistory();
  }, [getTreasuryHistory]);

  const data = useMemo(() => {
    return result?.treasuryHistory?.reduce(
      (result, item) => {
        result.data.push(item.balance);
        result.labels.push(item.date);
        return result;
      },
      {
        labels: [],
        data: [],
      },
    );
  }, [result?.treasuryHistory]);
  return {
    data,
    loading,
  };
}
