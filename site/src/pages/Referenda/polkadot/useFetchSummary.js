import { useEffect, useState } from "react";
import api from "../../../services/scanApi";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useSelector } from "react-redux";

export default function useFetchSummary() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    if (!chain) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

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
  }, [chain]);

  return { data, isLoading };
}
