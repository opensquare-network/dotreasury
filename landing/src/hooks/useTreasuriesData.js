import { gql, useLazyQuery } from "@apollo/client";
import { CHAINS, getChainSettings } from "@site/src/utils/chains";
import { toPrecision } from "@site/src/utils";
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
      const data = treasuries.filter(item => Object.keys(CHAINS).includes(item.chain)).map((treasury) => {
        const { decimals } = getChainSettings(treasury.chain);
        const amount = toPrecision(treasury.balance, decimals, false);
        const fiatValue = amount * treasury.price;

        return {
          ...treasury,
          amount,
          fiatValue,
        };
      });

      setTreasuriesData(data.sort((a, b) => b.fiatValue - a.fiatValue));
    });
  }, [fetch]);

  const treasuriesTotalValue = sumBy(treasuriesData, "fiatValue");

  return {
    data: treasuriesData,
    totalValue: treasuriesTotalValue,
  };
}
