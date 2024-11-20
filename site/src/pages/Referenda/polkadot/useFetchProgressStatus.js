import { useEffect, useState } from "react";
import api from "../../../services/scanApi";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useSelector } from "react-redux";

export default function useFetchProgressStatus() {
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
          // TODO: `https://${chain}.subsquare.io/api/gov2/referendums/progress-stats`
          "http://127.0.0.1:7071/gov2/referendums/progress-stats",
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
  }, [chain]);

  return { data, isLoading };
}
