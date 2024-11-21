import { useEffect, useState } from "react";
import api from "../../../../services/scanApi";

export default function useFetchSummary() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { result } = await api.fetch(
          `${
            import.meta.env.VITE_APP_SUBSQUARE_API_END_POINT
          }/gov2/tracks/active-and-total`,
        );

        setData(result);
      } catch (err) {
        console.error("Fetching referendums summary failed.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}
