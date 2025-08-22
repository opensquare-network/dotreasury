import { createContext, useContext, useState } from "react";
import useUserTreasuryProposals from "../hooks/useUserTreasuryProposals";
import { DEFAULT_PAGE_SIZE } from "../constants";

const Context = createContext({});

export function useUserTreasuryProposalsData() {
  return useContext(Context);
}

export function useUserTreasuryProposalsCount() {
  const { data } = useContext(Context) || {};
  return data?.total || 0;
}

export default function UserTreasuryProposalsProvider({ children, address }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data, loading } = useUserTreasuryProposals(address, page, pageSize);

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
