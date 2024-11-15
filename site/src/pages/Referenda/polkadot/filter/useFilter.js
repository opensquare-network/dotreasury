import { useHistory, useLocation } from "react-router";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import {
  getQueryStatus,
  toStatusQuery,
} from "../../../../components/Filter/useListFilter";

export default function useListFilter() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const defaultTrack = query.get("track") || "-1";
  const defaultStatus = getQueryStatus(query);
  const defaultAssets = query.get("assets") || "-1";

  const history = useHistory();
  const [filterStatus, setFilterStatus] = useState(defaultStatus);
  const [filterTrack, setFilterTrack] = useState(defaultTrack);
  const [filterAssets, setFilterAssets] = useState(defaultAssets);

  useEffect(() => {
    setFilterStatus(defaultStatus);
    setFilterTrack(defaultTrack);
    setFilterAssets(defaultAssets);
  }, [defaultStatus, defaultTrack, defaultAssets]);

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

    history.push({
      search: query.toString(),
    });
  }, [history, filterStatus, filterTrack, filterAssets]);

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

    return {
      ...filterData,
    };
  }, [filterStatus, filterTrack, filterAssets]);

  return {
    filterStatus,
    setFilterStatus,
    filterTrack,
    setFilterTrack,
    getFilterData,
    filterAssets,
    setFilterAssets,
  };
}