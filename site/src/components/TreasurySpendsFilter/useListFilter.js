import { useHistory, useLocation } from "react-router";
import { useCallback, useState } from "react";
import { useEffect } from "react";

export function useTreasurySpendsFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultStatus = query.get("status") || "-1";

  const history = useHistory();
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    setStatus(defaultStatus);
  }, [defaultStatus]);

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);

    if (status !== "-1") {
      query.set("status", status);
    } else {
      query.delete("status");
    }

    history.push({
      search: query.toString(),
    });
  }, [history, status]);

  const getFilterData = useCallback(() => {
    let filterData = {};

    if (status !== "-1") {
      filterData.status = status;
    }

    return {
      ...filterData,
    };
  }, [status]);

  return {
    status,
    setStatus,
    getFilterData,
  };
}
