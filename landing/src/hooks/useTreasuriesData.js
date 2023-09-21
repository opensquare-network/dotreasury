import { gql, useLazyQuery } from "@apollo/client";
import { getChainSettings } from "../utils/chains";
import { toPrecision } from "../../../site/src/utils";
import sumBy from "lodash.sumby";
import { useEffect } from "react";
import { useState } from "react";

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
  const [fetch] = useLazyQuery(GET_TREASURIES);
  const [treasuriesData, setTreasuriesData] = useState([]);

  useEffect(() => {
    fetch().then((resp) => {
      const treasuries = resp.data?.treasuries || [];
      const data = treasuries.map((treasury) => {
        const { decimals } = getChainSettings(treasury.chain);
        const amount = toPrecision(treasury.balance, decimals, false);
        const value = amount * treasury.price;

        return {
          ...treasury,
          amount,
          value,
        };
      });

      setTreasuriesData(data);
    });
  }, []);

  const treasuriesTotalValue = sumBy(treasuriesData, "value");

  return {
    data: treasuriesData,
    totalValue: treasuriesTotalValue,
  };
}
