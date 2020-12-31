import { useLayoutEffect, useState, useEffect } from "react";
import {getIndentity} from "../services/chainApi";

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export const useIndentity = (address) => {
  const [name, setName] = useState(null)
  const [badgeData, setBadgeData] = useState(null)
  useEffect(() => {
    let isMounted = true;
    const fetchIdentity = async () => {
      let identity;
      if (sessionStorage.getItem(`identity_${address}`)) {
        identity = JSON.parse(sessionStorage.getItem(`identity_${address}`));
      } else {
        identity = await getIndentity(address);
        sessionStorage.setItem(`identity_${address}`, JSON.stringify(identity));
      }
      if (isMounted && identity && identity.display) {
        setName(identity.displayParent ? `${identity.displayParent}/${identity.display}` : identity.display)
        setBadgeData({
          isDisplay: !!identity.display,
          hasParent: !!identity.displayParent,
          hasJudgement: identity.judgements?.length > 0
        })
      }
    }
    setName(null)
    setBadgeData(null)
    fetchIdentity()
    return () => {
      isMounted = false;
    }
  }, [address]);
  return {name, badgeData}
}
