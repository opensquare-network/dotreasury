import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import subsquareApi from "../services/subsquareApi";
import { useQuery } from "../utils/hooks";

export default function useUserChildBounties(address, page = 1, pageSize = 20) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const chain = useSelector(chainSelector);
  const query = useQuery();
  const sort = useMemo(() => {
    return query.get("sort");
  }, [query]);

  const queryParams = useMemo(() => {
    return {
      page,
      pageSize,
      ...(sort && { sort }),
    };
  }, [page, pageSize, sort]);

  const fetchData = useCallback(async () => {
    try {
      const { result } = await subsquareApi.fetch(
        `/beneficiaries/${address}/child-bounties`,
        queryParams,
      );

      if (result) {
        setData(result || { items: [], total: 0 });
      }
    } catch (err) {
      console.error(
        `Error fetching child bounties for address ${address}:`,
        err.message,
      );
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [address, queryParams]);

  useEffect(() => {
    if (!address || !chain) {
      return;
    }

    setLoading(true);
    fetchData();
  }, [address, chain, fetchData]);

  return { data, loading };
}
