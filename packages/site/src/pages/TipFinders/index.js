import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { overviewSelector } from "../../store/reducers/overviewSlice";
import {
  fetchTipFinders,
  tipFindersSelector,
  loadingSelector,
} from "../../store/reducers/tipFindersSlice";
import { chainSelector } from "../../store/reducers/chainSlice";
import TipFindersTable from "./TipFindersTable";
import Text from "../../components/Text";
import { useLocalStorage, useQuery } from "../../utils/hooks";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useState } from "react";
import { useHistory } from "react-router";
import ResponsivePagination from "../../components/ResponsivePagination";
import { useEffect } from "react";

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
`;

const Title = styled(Text)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`;

export default function TipFinders() {
  const overview = useSelector(overviewSelector);
  const data = overview.bestTipFinders || [];

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;

  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "tipFindersPageSize",
    DEFAULT_PAGE_SIZE
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tipFinders, total } = useSelector(tipFindersSelector);
  const loading = useSelector(loadingSelector);
  const totalPages = Math.ceil(total / pageSize);
  const chain = useSelector(chainSelector);

  useEffect(() => {
    dispatch(fetchTipFinders(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  return (
    <TipFindersTable
      data={data}
      loading={loading}
      header={
        <TitleContainer>
          <Title>Tip Finders</Title>
        </TitleContainer>
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
  );
}
