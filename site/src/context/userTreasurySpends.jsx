import { createContext, useContext, useState } from "react";
import useUserTreasurySpends from "../hooks/useUserTreasurySpends";
import { DEFAULT_PAGE_SIZE } from "../constants";

const Context = createContext({});

export function useUserTreasurySpendsData() {
  return useContext(Context);
}

export function useUserTreasurySpendsCount() {
  const { data } = useContext(Context) || {};
  return data?.total || 0;
}

export default function UserTreasurySpendsProvider({ children, address }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, loading } = useUserTreasurySpends(address, page, pageSize);

  const contextValue = {
    data,
    loading,
    page,
    setPage,
    pageSize,
    setPageSize,
    count: data?.total || 0,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
