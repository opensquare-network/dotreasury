import { createContext } from "react";
import { useContext } from "react";
import useFetchReferendumsList from "../hooks/applications/polkadot/useFetchReferendumsList";

const Context = createContext({});

export const DISPLAY_TRACKS_ITEMS = [
  "treasurer",
  "small_tipper",
  "big_tipper",
  "small_spender",
  "medium_spender",
  "big_spender",
];

export function usePolkadotApplicationsData() {
  return useContext(Context);
}

export function usePolkadotApplicationsTrackOptions() {
  const { data } = useContext(Context) || {};

  const trackNames = Array.from(
    new Set(
      data?.items?.map((item) => {
        if (!item.trackInfo?.name) {
          return "";
        }
        if (!DISPLAY_TRACKS_ITEMS.includes(item.trackInfo?.name)) {
          return "Others";
        }

        return item.trackInfo?.name
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }),
    ),
  );
  return trackNames;
}

export default function PolkadotApplicationsProvider({ children }) {
  const { data, isLoading } = useFetchReferendumsList();

  return (
    <Context.Provider value={{ data, isLoading }}>{children}</Context.Provider>
  );
}
