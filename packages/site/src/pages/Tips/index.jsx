import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import TipsTable from "./TipsTable";
import Filter, { RangeTypes } from "./Filter";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTips,
  loadingSelector,
  normalizedTipListSelector,
  resetTips,
} from "../../store/reducers/tipSlice";
import { chainSelector, chainSymbolSelector } from "../../store/reducers/chainSlice";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";
import { useHistory } from "react-router";
import Text from "../../components/Text";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import NewTipButton from "./NewTipButton";
import useWaitSyncBlock from "../../utils/useWaitSyncBlock";
import EndorseTipsButton from "./EndorseTipsButton";
import Divider from "../../components/Divider";
import useListFilter from "./useListFilter";
import isEmpty from "lodash.isempty";
import { getPrecision } from "../../utils";
import BigNumber from "bignumber.js";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  @media screen and (max-width: 640px) {
    flex-direction: column;
  }
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 24px;
`;

const Tips = () => {
  useChainRoute();
  const query = useQuery();

  const searchPage = parseInt(query.get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;

  const sort = query.get("sort");
  const symbol = useSelector(chainSymbolSelector);
  const precision = getPrecision(symbol);

  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "tipsPageSize",
    DEFAULT_PAGE_SIZE
  );

  const {
    filterStatus,
    setFilterStatus,
    rangeType,
    setRangeType,
    min,
    setMin,
    max,
    setMax,
  } = useListFilter();

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tips, total } = useSelector(normalizedTipListSelector);
  const loading = useSelector(loadingSelector);
  const totalPages = Math.ceil(total / pageSize);
  const chain = useSelector(chainSelector);

  const getFilterData = useCallback(() => {
    const status = filterStatus === "-1" ? "" : filterStatus;
    let minMax = {};
    if (rangeType === RangeTypes.Token) {
      if (min) minMax.min = new BigNumber(min).times(Math.pow(10, precision)).toString();
      if (max) minMax.max = new BigNumber(max).times(Math.pow(10, precision)).toString();
    } else {
      if (min) minMax.min = min;
      if (max) minMax.max = max;
    }
    if (!isEmpty(minMax)) minMax.rangeType = rangeType;

    const filterData = {
      status,
      ...minMax,
    };

    return filterData;
  }, [filterStatus, rangeType, min, max, precision]);

  useEffect(() => {
    const filterData = getFilterData();
    dispatch(fetchTips(chain, tablePage - 1, pageSize, filterData, sort && { sort }));

    return () => {
      dispatch(resetTips());
    };
  }, [dispatch, chain, tablePage, pageSize, getFilterData, sort]);

  const refreshTips = useCallback(
    () => {
      const filterData = getFilterData();
      dispatch(fetchTips(chain, tablePage - 1, pageSize, filterData, sort && { sort }));
    },
    [dispatch, chain, tablePage, pageSize, getFilterData, sort]
  );

  const onFinalized = useWaitSyncBlock("Tips created", refreshTips);

  return (
    <>
      <TipsTable
        data={tips}
        loading={loading}
        header={
          <div>
            <HeaderWrapper>
              <Title>Tips</Title>
              <div style={{ display: "flex", gap: "16px" }}>
                <NewTipButton onFinalized={onFinalized} />
                <EndorseTipsButton onFinalized={onFinalized} />
              </div>
            </HeaderWrapper>
            <Divider />
            <FilterWrapper>
              <Filter
                chain={chain}
                status={filterStatus}
                setStatus={setFilterStatus}
                rangeType={rangeType}
                setRangeType={setRangeType}
                min={min}
                setMin={setMin}
                max={max}
                setMax={setMax}
              />
            </FilterWrapper>
          </div>
        }
        footer={
          <ResponsivePagination
            activePage={tablePage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={(pageSize) => {
              const searchParams = new URLSearchParams(history.location.search);
              searchParams.delete("page");
              history.push({ search: searchParams.toString() });

              setTablePage(DEFAULT_QUERY_PAGE);
              setPageSize(pageSize);
            }}
            onPageChange={(_, { activePage }) => {
              const searchParams = new URLSearchParams(history.location.search);
              if (activePage === DEFAULT_QUERY_PAGE) {
                searchParams.delete("page");
              } else{
                searchParams.set("page", activePage);
              }
              history.push({ search: searchParams.toString() });

              setTablePage(activePage);
            }}
          />
        }
      />
    </>
  );
};

export default Tips;
