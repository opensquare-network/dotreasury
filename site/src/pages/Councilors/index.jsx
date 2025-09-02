import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router";
import CouncilorsTable from "./CouncilorsTable";
import ResponsivePagination from "../../components/ResponsivePagination";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import Card from "../../components/Card";
import { h4_16_semibold } from "../../styles/text";
import useCouncilors from "../../hooks/useCouncilors";

const Title = styled.div`
  ${h4_16_semibold};
  padding: 20px 24px;
  color: var(--textPrimary);
`;

const CardWrapper = styled(Card)`
  overflow-x: hidden;
  padding: 0;
  table {
    border-radius: 0 !important;
    border: none !important;
  }
  @media screen and (max-width: 600px) {
    border-radius: 0;
  }
`;

export default function Councilors() {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "councilorsPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const history = useHistory();
  const { councilors, loading } = useCouncilors(tablePage - 1, pageSize);
  const { items: tableData, total } = councilors || { items: [], total: 0 };

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setTablePage(DEFAULT_QUERY_PAGE);
  }, [history]);

  const onPageSizeChange = useCallback(
    (size) => {
      const searchParams = new URLSearchParams(history.location.search);
      searchParams.delete("page");
      history.push({ search: searchParams.toString() });

      setTablePage(DEFAULT_QUERY_PAGE);
      setPageSize(size);
    },
    [history, setPageSize],
  );

  const onPageChange = useCallback(
    (_, { activePage }) => {
      const searchParams = new URLSearchParams(history.location.search);
      if (activePage === DEFAULT_QUERY_PAGE) {
        searchParams.delete("page");
      } else {
        searchParams.set("page", activePage);
      }
      history.push({ search: searchParams.toString() });

      setTablePage(activePage);
    },
    [history],
  );

  return (
    <CardWrapper>
      <div style={{ width: "100%" }}>
        <Title>Councilors</Title>
      </div>

      <CouncilorsTable data={tableData} loading={loading} />

      {!!tableData?.length && (
        <ResponsivePagination
          activePage={tablePage}
          totalPages={totalPages}
          pageSize={pageSize}
          setPageSize={onPageSizeChange}
          onPageChange={onPageChange}
        />
      )}
    </CardWrapper>
  );
}
