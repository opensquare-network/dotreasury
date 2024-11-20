import { useEffect, useState } from "react";
import api from "../../../services/scanApi";
import { chainSelector } from "../../../store/reducers/chainSlice";
import { useSelector } from "react-redux";

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
  const chain = useSelector(chainSelector);

  useEffect(() => {
    if (!chain) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { result } = await api.fetch(
          // TODO: `https://${chain}.subsquare.io/api/gov2/referendums`
          "http://127.0.0.1:7071/gov2/referendums",
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
  }, [page, pageSize, JSON.stringify(filterData), JSON.stringify(sort), chain]);

  return { data, isLoading };
}
