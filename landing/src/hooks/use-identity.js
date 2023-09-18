// copied from site/src/utils/hooks
// without redux

import { useEffect, useState } from "react";
import { fetchIdentity as getIdentity } from "../../../site/src/services/identity";

const displayCache = new Map();

export const useIdentity = (chain, address) => {
  const [name, setName] = useState(null);
  const [badgeData, setBadgeData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchIdentity = async () => {
      let identity;
      if (displayCache.has(`identity_${address}`)) {
        identity = displayCache.get(`identity_${address}`);
      } else {
        identity = await getIdentity(chain, address);
        displayCache.set(`identity_${address}`, identity);
      }
      if (isMounted && identity) {
        setName(identity.info?.display);
        setBadgeData({
          status: identity.info?.status,
        });
      }
    };
    setName(null);
    setBadgeData(null);
    fetchIdentity();
    return () => {
      isMounted = false;
    };
  }, [address, chain]);
  return { name, badgeData };
};
