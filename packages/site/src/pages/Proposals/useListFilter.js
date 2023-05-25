import { useHistory, useLocation } from "react-router";
import { RangeTypes } from "../pages/Referenda/Filter";
import { useState } from "react";
import { useEffect } from "react";

export default function useListFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultStatus = query.get("status") || "-1";
  const defaultRangeType = query.get("range_type") || RangeTypes.Token;
  const defaultMin = query.get("min") || "";
  const defaultMax = query.get("max") || "";

  const history = useHistory();
  const [filterStatus, setFilterStatus] = useState(defaultStatus);
  const [rangeType, setRangeType] = useState(defaultRangeType);
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  useEffect(() => {
    const query = new URLSearchParams(history.location.href);

    if (filterStatus !== "-1") {
      query.set("status", filterStatus);
    } else {
      query.delete("status");
    }

    if (rangeType !== RangeTypes.Token) {
      query.set("range_type", rangeType);
    } else {
      query.delete("range_type");
    }

    if (min) {
      query.set("min", min);
    } else {
      query.delete("min");
    }

    if (max) {
      query.set("max", max);
    } else {
      query.delete("max");
    }

    history.push({
      search: query.toString(),
    });
  }, [history, filterStatus, rangeType, min, max]);

  return {
    filterStatus,
    setFilterStatus,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
  };
}
