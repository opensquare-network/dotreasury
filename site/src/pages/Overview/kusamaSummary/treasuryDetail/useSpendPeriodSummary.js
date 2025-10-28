import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "../../../../services/chainApi";
import { currentChainSettings } from "../../../../utils/chains";
import useAssetHubApi from "../../../../hooks/assetHub/useAssetHubApi";
import { chainSelector } from "../../../../store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { scanHeightSelector } from "../../../../store/reducers/chainSlice";

function useSpendPeriod(api) {
  const [spendPeriod, setSpendPeriod] = useState(null);

  useEffect(() => {
    if (!api || !api.consts || !api.consts?.treasury?.spendPeriod) {
      return;
    }

    setSpendPeriod(api.consts.treasury.spendPeriod.toNumber());
  }, [api]);

  return spendPeriod;
}

function useLastSpendPeriod(api) {
  const [lastSpendPeriod, setLastSpendPeriod] = useState(null);

  useEffect(() => {
    if (!api || !api.query || !api.query?.treasury?.lastSpendPeriod) {
      return;
    }

    api.query.treasury.lastSpendPeriod().then((result) => {
      setLastSpendPeriod(result?.toString() || null);
    });
  }, [api]);

  return lastSpendPeriod;
}

export default function useSpendPeriodSummary() {
  const api = useAssetHubApi();
  const latestHeight = useSelector(scanHeightSelector);
  const [summary, setSummary] = useState({});
  const isMounted = useMountedState();
  const { blockTime } = currentChainSettings;
  const lastSpendPeriod = useLastSpendPeriod(api);
  const spendPeriod = useSpendPeriod(api);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    if (
      !api ||
      !chain ||
      !spendPeriod ||
      !blockTime ||
      !lastSpendPeriod ||
      !latestHeight
    ) {
      return;
    }

    const goneBlocks = new BigNumber(latestHeight)
      .minus(lastSpendPeriod)
      .toNumber();

    const progress = new BigNumber(goneBlocks)
      .div(spendPeriod)
      .multipliedBy(100)
      .toNumber();

    if (!goneBlocks) {
      return;
    }

    if (isMounted()) {
      const restBlocks = new BigNumber(spendPeriod)
        .minus(goneBlocks)
        .toNumber();

      estimateBlocksTime(chain, spendPeriod).then((periodTime) => {
        setSummary({
          progress,
          periodTime,
          restBlocks,
        });
      });
    }
  }, [
    api,
    blockTime,
    chain,
    isMounted,
    lastSpendPeriod,
    latestHeight,
    spendPeriod,
  ]);

  return summary;
}
