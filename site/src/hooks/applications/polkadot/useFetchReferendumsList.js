import { useEffect, useState } from "react";
import api from "../../../services/subsquareApi";

export default function useFetchReferendumsList() {
  const [data, setData] = useState({
    items: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const { result = [] } = await api.fetch(
          "/gov2/referenda/treasury-applications",
        );
        setData({ items: result, total: result.length });
      } catch (err) {
        console.error("Fetching referendums failed.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}
