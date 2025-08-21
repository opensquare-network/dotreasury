import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import subsquareApi from "../services/subsquareApi";

export default function useUserTips(address, page = 1, pageSize = 20) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const chain = useSelector(chainSelector);

  const fetchData = useCallback(async () => {
    try {
      const queryParams = {
        page,
        pageSize,
      };

      const { result } = await subsquareApi.fetch(
        `/beneficiaries/${address}/tips`,
        queryParams,
      );

      if (result) {
        setData(result || { items: [], total: 0 });
      }
    } catch (err) {
      throw new Error(
        `Error fetching tips for address ${address}: ${err.message}`,
      );
    } finally {
      setLoading(false);
    }
  }, [address, page, pageSize]);

  useEffect(() => {
    if (!address || !chain) {
      return;
    }

    fetchData();
  }, [address, chain, fetchData]);

  return { data, loading };
}
