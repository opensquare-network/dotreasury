import useFiatPriceSnapshot from "./useFiatPriceSnapshot";
import { useState, useEffect } from "react";
import subsquareApi from "../../services/subsquareApi";
import { getChainSettings } from "../../utils/chains";
import BigNumber from "bignumber.js";
import { toPrecision } from "../../utils";
import { SYMBOL_DECIMALS } from "../../constants/statemint";
import { currentChain } from "../../utils/chains";

function cumulativeFiatAmount(amounts, price, chain) {
  if (!price) {
    return new BigNumber(0);
  }

  const { symbol, decimals } = getChainSettings(chain);

  const supportedSymbols = ["USDC", "USDT"];
  return amounts.reduce((acc, curr) => {
    if (curr.symbol === symbol) {
      const amount = BigNumber(toPrecision(curr.amount, decimals));
      return acc.plus(amount.multipliedBy(price));
    } else if (
      supportedSymbols.includes(curr.symbol) &&
      SYMBOL_DECIMALS[curr.symbol]
    ) {
      return acc.plus(toPrecision(curr.amount, SYMBOL_DECIMALS[curr.symbol]));
    }
    return acc;
  }, new BigNumber(0));
}

export default function useTreasuryRequestingData() {
  const { price, loading: priceLoading } = useFiatPriceSnapshot();
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState([]);
  const [confirming, setConfirming] = useState([]);

  useEffect(() => {
    setLoading(true);
    subsquareApi
      .fetch("/gov2/referenda/treasury-requesting")
      .then(({ result: data }) => {
        setConfirming(data?.confirmingSpends || []);
        setRequesting(data?.requestingSpends || []);
      })

      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    loading: priceLoading || loading,
    requestingValue: cumulativeFiatAmount(requesting, price, currentChain),
    confirmingValue: cumulativeFiatAmount(confirming, price, currentChain),
  };
}
