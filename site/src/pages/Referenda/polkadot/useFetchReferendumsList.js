import { useEffect, useState } from "react";
import api from "../../../services/scanApi";

export default function useFetchReferendumsList(
  page = 0,
  pageSize = 20,
  filterData = {},
  sort = {},
) {
  const [data, setData] = useState({
    items: [],
    page: 0,
    pageSize: 20,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { result } = await api.fetch(
          `${import.meta.env.VITE_APP_SUBSQUARE_SERVER}/gov2/referendums`,
          {
            is_active: true,
            is_treasury: true,
            page,
            pageSize,
            ...filterData,
            ...sort,
          },
        );

        setData(result || { items: [], page: 0, pageSize: 10, total: 0 });
      } catch (err) {
        console.error("Fetching referendums failed.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, filterData, sort]);

  return { data, isLoading };
}
