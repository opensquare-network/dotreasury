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

export function useApplicationsData() {
  return useContext(Context);
}

export function useApplicationsSummary() {
  const { data, isLoading } = useContext(Context) || {};

  const summaryData = data?.items?.map((item) => {
    return item.trackInfo?.name;
  });

  const countMap = summaryData.reduce((acc, name) => {
    if (!acc[name]) {
      acc[name] = { name, activeCount: 0 };
    }

    acc[name].activeCount++;
    return acc;
  }, {});

  const result = Object.values(countMap).map(
    ({ name, activeCount, total }) => ({
      name,
      activeCount,
      total,
    }),
  );

  return {
    isLoading,
    data: result,
  };
}

export function useApplicationsTrackOptions() {
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

export default function ApplicationsProvider({ children }) {
  const { data, isLoading } = useFetchReferendumsList();

  return (
    <Context.Provider value={{ data, isLoading }}>{children}</Context.Provider>
  );
}
