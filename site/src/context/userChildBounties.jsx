import { createContext, useContext, useState } from "react";
import useUserChildBounties from "../hooks/useUserChildBounties";
import { DEFAULT_PAGE_SIZE } from "../constants";

const Context = createContext({});

export function useUserChildBountiesData() {
  return useContext(Context);
}

export function useUserChildBountiesCount() {
  const { data } = useContext(Context) || {};
  return data?.total || 0;
}

export default function UserChildBountiesProvider({ children, address }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, loading } = useUserChildBounties(address, page, pageSize);

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
