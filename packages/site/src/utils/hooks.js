import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";

import { fetchIdentity as getIdentity } from "../services/identity";
import { setShowMenuTabs } from "../store/reducers/menuSlice";
import {
  chainSelector,
  chainSymbolSelector,
  setChain,
} from "../store/reducers/chainSlice";

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

const displayCache = new Map();

export const useIdentity = (address, map) => {
  const [name, setName] = useState(null);
  const [badgeData, setBadgeData] = useState(null);
  const chain = useSelector(chainSelector);
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

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const useLinks = (text) => {
  if (text && typeof text === "string") {
    const links = [
      ...text.matchAll(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,8}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
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
  const symbol = useSelector(chainSymbolSelector)?.toLowerCase();
  const { pathname } = useLocation();
  useEffect(() => {
    const menuTabsName = pathname.startsWith(`/${symbol}/income`)
      ? "Income"
      : pathname.startsWith(`/${symbol}/projects`)
      ? "Projects"
      : "Home";
    dispatch(setShowMenuTabs(menuTabsName));
  }, [pathname, dispatch, symbol]);
};

export function useChainRoute() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const symbol = useSelector(chainSymbolSelector).toLowerCase();
  const { symbol: paramSymbol } = useParams();
  const urlSymbol = paramSymbol?.toLowerCase();
  useEffect(() => {
    if (!urlSymbol) {
      return history.push(`/${symbol}${location.pathname}`);
    } else if (urlSymbol !== symbol) {
      dispatch(setChain(urlSymbol));
      window.location.reload();
    }
  }, [dispatch, history, location, symbol, urlSymbol]);
}

export function useOutsideClick(ref, cb) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, cb]);
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}

export function useWhyDidYouUpdate(name, props) {
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};
      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }
    previousProps.current = props;
  });
}

export function useIsAdmin() {
  const location = useLocation();
  const q = queryString.parse(location.search);
  const isAdmin = q.admin === "true";
  return isAdmin;
}
