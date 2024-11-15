import { useHistory, useLocation } from "react-router";
import { RangeTypes } from "../../components/Filter/Range";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { getPrecision } from "../../utils";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import isEmpty from "lodash.isempty";
import { getQueryStatus, toStatusQuery } from "../Filter/useListFilter";

export default function useListFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultTrack = query.get("track") || "-1";
  const defaultStatus = getQueryStatus(query);
  const defaultAssets = query.get("assets") || "-1";
  const defaultRangeType = query.get("range_type") || RangeTypes.Token;
  const defaultMin = query.get("min") || "";
  const defaultMax = query.get("max") || "";

  const history = useHistory();
  const [filterStatus, setFilterStatus] = useState(defaultStatus);
  const [filterTrack, setFilterTrack] = useState(defaultTrack);
  const [filterAssets, setFilterAssets] = useState(defaultAssets);
  const [rangeType, setRangeType] = useState(defaultRangeType);
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  useEffect(() => {
    setFilterStatus(defaultStatus);
    setFilterTrack(defaultTrack);
    setFilterAssets(defaultAssets);
    setRangeType(defaultRangeType);
    setMin(defaultMin);
    setMax(defaultMax);
  }, [
    defaultStatus,
    defaultTrack,
    defaultAssets,
    defaultRangeType,
    defaultMin,
    defaultMax,
  ]);

  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);

    if (filterStatus !== "-1") {
      query.set("status", toStatusQuery(filterStatus));
    } else {
      query.delete("status");
    }

    if (filterTrack !== "-1") {
      query.set("track", filterTrack);
    } else {
      query.delete("track");
    }

    if (filterAssets !== "-1") {
      query.set("assets", filterAssets);
    } else {
      query.delete("assets");
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
  }, [history, filterStatus, filterTrack, filterAssets, rangeType, min, max]);

  const getFilterData = useCallback(() => {
    let filterData = {};

    if (filterStatus !== "-1") {
      filterData.status = filterStatus;
    }

    if (filterTrack !== "-1") {
      filterData.track = filterTrack;
    }

    if (filterAssets !== "-1") {
      filterData.assets = filterAssets;
    }

    let minMax = {};
    if (rangeType === RangeTypes.Token) {
      if (min)
        minMax.min = new BigNumber(min)
          .times(Math.pow(10, precision))
          .toString();
      if (max)
        minMax.max = new BigNumber(max)
          .times(Math.pow(10, precision))
          .toString();
    } else {
      if (min) minMax.min = min;
      if (max) minMax.max = max;
    }
    if (!isEmpty(minMax)) minMax.rangeType = rangeType;

    return {
      ...filterData,
      ...minMax,
    };
  }, [filterStatus, filterTrack, filterAssets, rangeType, min, max, precision]);

  return {
    filterStatus,
    setFilterStatus,
    filterTrack,
    setFilterTrack,
    filterAssets,
    setFilterAssets,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  };
}
