import { useHistory, useLocation } from "react-router";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getPrecision } from "../../utils";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { getQueryStatus, toStatusQuery } from "../Filter/useListFilter";

export function useTreasurySpendsFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultAsset = query.get("asset") || "-1";
  const defaultStatus = getQueryStatus(query);
  const defaultMin = query.get("min") || "";
  const defaultMax = query.get("max") || "";

  const history = useHistory();
  const [filterStatus, setFilterStatus] = useState(defaultStatus);
  const [filterAsset, setFilterAsset] = useState(defaultAsset);
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  useEffect(() => {
    setFilterStatus(defaultStatus);
    setFilterAsset(defaultAsset);
    setMin(defaultMin);
    setMax(defaultMax);
  }, [defaultStatus, defaultAsset, defaultMin, defaultMax]);

  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);

    if (filterStatus !== "-1") {
      query.set("status", toStatusQuery(filterStatus));
    } else {
      query.delete("status");
    }

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
  }, [history, filterStatus, filterAsset, min, max]);

  const getFilterData = useCallback(() => {
    let filterData = {};

    if (filterStatus !== "-1") {
      filterData.status = filterStatus;
    }

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
  }, [filterStatus, filterAsset, min, max]);

  return {
    filterStatus,
    setFilterStatus,
    filterAsset,
    setFilterAsset,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  };
}
