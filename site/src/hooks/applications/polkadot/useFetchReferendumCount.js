import { useEffect, useState } from "react";
import api from "../../../services/scanApi";

export default function useFetchReferendumCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { result } = await api.fetch(
          `${
            import.meta.env.VITE_APP_SUBSQUARE_API_END_POINT
          }/gov2/referenda/treasury-applications/count`,
        );

        const total = result?.total || 0;
        setCount(total);
      } catch (err) {
        console.error("Fetching referendums active count failed.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { count, isLoading };
}
