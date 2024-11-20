import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

export default function useSort() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const sort = searchParams.get("sort");
  const [defaultSortField, defaultSortDirection] = sort ? sort.split("_") : [];
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  useEffect(() => {
    setSortField(defaultSortField);
    setSortDirection(defaultSortDirection);
  }, [defaultSortField, defaultSortDirection]);
  const history = useHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);

    if (sortField && sortDirection) {
      searchParams.set("sort", `${sortField}_${sortDirection}`);
      history.push({ search: searchParams.toString() });
    } else if (isNil(sortField)) {
      searchParams.delete("sort");
      history.push({ search: searchParams.toString() });
    }
  }, [history, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
  };
}
