import { useHistory, useLocation } from "react-router";
import { RangeTypes } from "../../components/Filter/Range";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { chainSymbolSelector } from "../../store/reducers/chainSlice";
import { getPrecision } from "../../utils";
import isEmpty from "lodash.isempty";
import snakeCase from "lodash.snakecase";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";

export const getQueryStatus = (query) => {
  const status = query.get("status");
  if (status) {
    const items = status.split("||");
    return items
      .map((item) => (item === "tip" ? item : upperFirst(camelCase(item))))
      .join("||");
  }
  return "-1";
};

export const toStatusQuery = (status) => {
  const items = status.split("||");
  return items.map((item) => snakeCase(item)).join("||");
};

export default function useListFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultStatus = getQueryStatus(query);
  const defaultRangeType = query.get("range_type") || RangeTypes.Token;
  const defaultMin = query.get("min") || "";
  const defaultMax = query.get("max") || "";

  const history = useHistory();
  const [filterStatus, setFilterStatus] = useState(defaultStatus);
  const [rangeType, setRangeType] = useState(defaultRangeType);
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  useEffect(() => {
    setFilterStatus(defaultStatus);
    setRangeType(defaultRangeType);
    setMin(defaultMin);
    setMax(defaultMax);
  }, [defaultStatus, defaultRangeType, defaultMin, defaultMax]);

  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);

    if (filterStatus !== "-1") {
      query.set("status", toStatusQuery(filterStatus));
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

  const getFilterData = useCallback(() => {
    let filterData = {};

    if (filterStatus !== "-1") {
      filterData.status = filterStatus;
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
  }, [filterStatus, rangeType, min, max, precision]);

  return {
    filterStatus,
    setFilterStatus,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
    getFilterData,
  };
}
