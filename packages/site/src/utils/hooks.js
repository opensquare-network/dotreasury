import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getIndentity } from "../services/chainApi";
import { setShowMenuTabs } from "../store/reducers/menuSlice";
import { chainSelector } from "../store/reducers/chainSlice";

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export const useIndentity = (address) => {
  const [name, setName] = useState(null);
  const [badgeData, setBadgeData] = useState(null);
  const chain = useSelector(chainSelector);
  useEffect(() => {
    let isMounted = true;
    const fetchIdentity = async () => {
      let identity;
      if (sessionStorage.getItem(`identity_${address}`)) {
        identity = JSON.parse(sessionStorage.getItem(`identity_${address}`));
      } else {
        identity = await getIndentity(chain, address);
        sessionStorage.setItem(`identity_${address}`, JSON.stringify(identity));
      }
      if (isMounted && identity && identity.display) {
        setName(
          identity.displayParent
            ? `${identity.displayParent}/${identity.display}`
            : identity.display
        );
        setBadgeData({
          isDisplay: !!identity.display,
          hasParent: !!identity.displayParent,
          hasJudgement: identity.judgements?.length > 0,
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

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const useLinks = (text) => {
  if (text && typeof text === "string") {
    const links = [
      ...text.matchAll(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
      ),
    ];
    return links.map((item) => ({ inReasons: true, link: item[0] }));
  }
  return null;
};

export function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted; // returning "isMounted.current" wouldn't work because we would return unmutable primitive
}

export const useDisablePopup = () => {
  const [disabledPopup, setDisabledPopup] = useState(true);
  const [width] = useWindowSize();
  useEffect(() => {
    setDisabledPopup(width < 1128);
  }, [width]);
  return disabledPopup;
};

export const usePreload = () => {
  useEffect(() => {
    const preloadImgList = ["/imgs/loading.svg"];

    function getPreloadImgAttr(url) {
      var img = new Image();
      img.src = url;
    }

    preloadImgList.forEach((item) => {
      getPreloadImgAttr(item);
    });
  }, []);
  return;
};

export const useMenuTab = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  useEffect(() => {
    const menuTabsName = pathname.startsWith("/income")
      ? "Income"
      : pathname.startsWith("/projects")
      ? "Projects"
      : "Home";
    dispatch(setShowMenuTabs(menuTabsName));
  }, [pathname, dispatch]);
};
