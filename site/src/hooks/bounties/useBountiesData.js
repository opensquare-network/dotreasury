import { useState } from "react";
import useApi from "../useApi";
import useCall from "../useCall";
import { useEffect } from "react";

function filterBountiesData(items) {
  return items.filter((item) => {
    const { isFunded, isCuratorProposed, isActive } =
      item?.bounty?.status || {};
    return isFunded || isCuratorProposed || isActive;
  });
}

export function useBountiesData() {
  const api = useApi();
  const [bounties, setBounties] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loaded, value } = useCall(api?.derive.bounties?.bounties);

  useEffect(() => {
    if (!api || !loaded) {
      return;
    }

    const filteredData = filterBountiesData(value);

    setBounties(filteredData);
    setIsLoading(!loaded);
  }, [api, loaded, value]);

  return {
    bounties,
    bountiesCount: bounties?.length || 0,
    isLoading,
  };
}
