import styled from "styled-components";
import GasFeeTable from "./GasFeeSlashTable";
import Text from "../../components/Text";
import ResponsivePagination from "../../components/ResponsivePagination";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useLocalStorage, useQuery } from "../../utils/hooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  fetchGasFeeList,
  gasFeeListSelector,
  loadingGasFeeListSelector,
} from "../../store/reducers/centrifugeGasFeeSlice";
import { useEffect } from "react";

const HeaderWrapper = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

export default function GasFeeSlash() {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "transfersSlashPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const dispatch = useDispatch();
  const history = useHistory();

  const { items: gasFeeList, total } = useSelector(gasFeeListSelector);
  const loading = useSelector(loadingGasFeeListSelector);

  useEffect(() => {
    dispatch(fetchGasFeeList(tablePage - 1, pageSize));
  }, [dispatch, tablePage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <GasFeeTable
        data={gasFeeList}
        loading={loading}
        header={
          <HeaderWrapper>
            <Title>Gas Fee</Title>
          </HeaderWrapper>
        }
        footer={
          <ResponsivePagination
            activePage={tablePage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={(pageSize) => {
              setTablePage(DEFAULT_QUERY_PAGE);
              setPageSize(pageSize);
              history.push({
                search: null,
              });
            }}
            onPageChange={(_, { activePage }) => {
              history.push({
                search:
                  activePage === DEFAULT_QUERY_PAGE
                    ? null
                    : `?page=${activePage}`,
              });
              setTablePage(activePage);
            }}
          />
        }
      />
    </div>
  );
}
