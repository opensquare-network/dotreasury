import { gql, useLazyQuery } from "@apollo/client";
import { CHAINS, getChainSettings } from "@site/src/utils/chains";
import { toPrecision } from "@site/src/utils";
import sumBy from "lodash.sumby";
import { useEffect } from "react";
import { useState } from "react";
import BigNumber from "bignumber.js";

const GET_TREASURIES = gql`
  query GetTreasuries {
    treasuries {
      balance
      balanceUpdateAt
      chain
      price
      priceUpdateAt
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

function getTreasuryFiatValue(treasury) {
  const { decimals } = getChainSettings(treasury.chain);
  const balances = treasury.balances || [
    { balance: treasury.balance, price: treasury.price, decimals },
  ];
  return balances
    .reduce(
      (acc, item) =>
        new BigNumber(item.balance)
          .div(Math.pow(10, item.decimals))
          .times(item.price)
          .plus(acc),
      0,
    )
    .toNumber();
}

function getTreasuryTokenAmount(treasury) {
  const { decimals } = getChainSettings(treasury.chain);
  return toPrecision(treasury.balance, decimals, false);
}

export function useTreasuriesData() {
  const [fetch] = useLazyQuery(GET_TREASURIES);
  const [treasuriesData, setTreasuriesData] = useState([]);

  useEffect(() => {
    fetch().then((resp) => {
      const treasuries = resp.data?.treasuries || [];
      const data = treasuries
        .filter((item) => Object.keys(CHAINS).includes(item.chain))
        .map((treasury) => {
          const amount = getTreasuryTokenAmount(treasury);
          const fiatValue = getTreasuryFiatValue(treasury);
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
