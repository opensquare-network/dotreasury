import { useEffect, useState } from "react";
import api from "../../../../services/scanApi";

export default function useFetchReferendumsList(filterData, sort) {
  const [data, setData] = useState({
    items: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { result = [] } = await api.fetch(
          `${
            import.meta.env.VITE_APP_SUBSQUARE_API_END_POINT
          }/gov2/referendums/treasury-applications`,
          {
            ...filterData,
            ...sort,
          },
        );
        setData({ items: result, total: result.length });
      } catch (err) {
        console.error("Fetching referendums failed.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterData), JSON.stringify(sort)]);

  return { data, isLoading };
}
