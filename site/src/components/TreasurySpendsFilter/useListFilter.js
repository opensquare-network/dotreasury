import { useHistory, useLocation } from "react-router";
import { useCallback, useState } from "react";
import { useEffect } from "react";

export function useTreasurySpendsFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultAsset = query.get("asset") || "-1";
  const defaultMin = query.get("min") || "";
  const defaultMax = query.get("max") || "";

  const history = useHistory();
  const [filterAsset, setFilterAsset] = useState(defaultAsset);
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  useEffect(() => {
    setFilterAsset(defaultAsset);
    setMin(defaultMin);
    setMax(defaultMax);
  }, [defaultAsset, defaultMin, defaultMax]);

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);

    if (filterAsset !== "-1") {
      query.set("asset", filterAsset);
    } else {
      query.delete("asset");
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
  }, [history, filterAsset, min, max]);

  const getFilterData = useCallback(() => {
    let filterData = {};

    if (filterAsset !== "-1") {
      filterData.asset = filterAsset;
    }

    let minMax = {};
    if (min) minMax.min = min;
    if (max) minMax.max = max;

    return {
      ...filterData,
      ...minMax,
    };
  }, [filterAsset, min, max]);

  return {
    filterAsset,
    setFilterAsset,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  };
}
