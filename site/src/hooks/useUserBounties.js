import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import subsquareApi from "../services/subsquareApi";
import { useQuery } from "../utils/hooks";

export default function useUserBounties(address, page = 1, pageSize = 20) {
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
        `/beneficiaries/${address}/bounties`,
        queryParams,
      );

      if (result) {
        setData(result || { items: [], total: 0 });
      }
    } catch (err) {
      throw new Error(
        `Error fetching bounties for address ${address}: ${err.message}`,
      );
    } finally {
      setLoading(false);
    }
  }, [address, queryParams]);

  useEffect(() => {
    if (!address || !chain) {
      return;
    }

    fetchData();
  }, [address, chain, fetchData, page]);

  return { data, loading };
}
