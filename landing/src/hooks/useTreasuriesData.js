import { useQuery, gql } from "@apollo/client";
import { getChainSettings } from "../utils/chains";
import { toPrecision } from "../../../site/src/utils";
import sumBy from "lodash.sumby";

const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      balance
      balanceUpdateAt
      chain
      price
      priceUpdateAt
    }
  }
`;

export function useTreasuriesData() {
  const { data } = useQuery(GET_TREASURIES);
  const treasuries = data?.treasuries || [];

  const treasuriesData = treasuries.map((treasury) => {
    const { decimals } = getChainSettings(treasury.chain);
    const amount = toPrecision(treasury.balance, decimals, false);
    const value = amount * treasury.price;

    return {
      ...treasury,
      amount,
      value,
    };
  });

  const treasuriesTotalValue = sumBy(treasuriesData, "value");

  return {
    data: treasuriesData,
    totalValue: treasuriesTotalValue,
  };
}
