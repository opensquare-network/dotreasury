import styled from "styled-components";
import ParticipantsTable from "./ParticipantsTable";
import { h4_16_semibold } from "../../styles/text";
import ResponsivePagination from "../../components/ResponsivePagination";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useChainRoute, useQuery, useLocalStorage } from "../../utils/hooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chainSelector } from "../../store/reducers/chainSlice";
import {
  fetchParticipants,
  loadingSelector,
  participantsSelector,
} from "../../store/reducers/participantsSlice";
import { useEffect } from "react";
import { useHistory } from "react-router";

const Title = styled.h4`
  ${h4_16_semibold};
`;

export default function Participants() {
  useChainRoute();

  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "projectsPageSize",
    DEFAULT_PAGE_SIZE
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tableData, total } = useSelector(participantsSelector);
  const loading = useSelector(loadingSelector);
  const chain = useSelector(chainSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    dispatch(fetchParticipants(chain, tablePage - 1, pageSize));
  }, [dispatch, chain, tablePage, pageSize]);

  return (
    <ParticipantsTable
      data={tableData}
      loading={loading}
      header={<Title>Participants</Title>}
      footer={
        !!tableData?.length && (
          <ResponsivePagination
            activePage={tablePage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={(size) => {
              setTablePage(DEFAULT_QUERY_PAGE);
              setPageSize(size);
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
        )
      }
    />
  );
}
