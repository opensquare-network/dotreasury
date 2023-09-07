import { useHistory, useLocation } from "react-router";
import { useCallback, useState } from "react";
import { useEffect } from "react";

export default function useListFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultRole = query.get("role") || "-1";

  const history = useHistory();
  const [role, setRole] = useState(defaultRole);

  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);

    if (role !== "-1") {
      query.set("role", role);
    } else {
      query.delete("role");
    }

    history.push({
      search: query.toString(),
    });
  }, [history, role]);

  const getFilterData = useCallback(() => {
    const filterData = {
      role: role === "-1" ? "" : role,
    };

    return filterData;
  }, [role]);

  return {
    role,
    setRole,
    getFilterData,
  };
}
