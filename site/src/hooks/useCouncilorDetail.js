import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { chainSelector } from "../store/reducers/chainSlice";
import api from "../services/scanApi";

export default function useCouncilorDetail(address) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chain = useSelector(chainSelector);

  const fetchData = useCallback(async () => {
    try {
      const { result } = await api.fetch(`/participants/${address}`);

      if (result) {
        setData(result);
      }
    } catch (err) {
      throw new Error(
        `Error fetching councilor detail for address ${address}: ${err.message}`,
      );
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (!address || !chain) {
      return;
    }

    fetchData();
  }, [address, chain, fetchData]);

  return { data, loading };
}
