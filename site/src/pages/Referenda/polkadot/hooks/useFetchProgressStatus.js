import { useEffect, useState } from "react";
import api from "../../../../services/scanApi";

export default function useFetchProgressStatus() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { result } = await api.fetch(
          `${
            import.meta.env.VITE_APP_SUBSQUARE_API_END_POINT
          }/gov2/referendums/progress-stats`,
          {
            is_treasury: true,
          },
        );

        setData(result);
      } catch (err) {
        console.error("Fetching referendums progress status failed.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
}
