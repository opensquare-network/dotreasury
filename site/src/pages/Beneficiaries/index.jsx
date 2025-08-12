import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import BeneficiariesTable from "./BeneficiariesTable";
import ResponsivePagination from "../../components/ResponsivePagination";
import { DEFAULT_PAGE_SIZE, DEFAULT_QUERY_PAGE } from "../../constants";
import { useQuery, useLocalStorage } from "../../utils/hooks";
import {
  beneficiariesSelector,
  fetchBeneficiaries,
  loadingSelector,
} from "../../store/reducers/beneficiariesSlice";
import Card from "../../components/Card";
import { h4_16_semibold } from "../../styles/text";

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

export default function Beneficiaries() {
  const searchPage = parseInt(useQuery().get("page"));
  const queryPage =
    searchPage && !isNaN(searchPage) && searchPage > 0
      ? searchPage
      : DEFAULT_QUERY_PAGE;
  const [tablePage, setTablePage] = useState(queryPage);
  const [pageSize, setPageSize] = useLocalStorage(
    "projectsPageSize",
    DEFAULT_PAGE_SIZE,
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const { items: tableData, total } = useSelector(beneficiariesSelector);
  const loading = useSelector(loadingSelector);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete("page");
    history.push({ search: searchParams.toString() });

    setTablePage(DEFAULT_QUERY_PAGE);
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchBeneficiaries(
        tablePage,
        pageSize,
        {},
        {
          signal: controller.signal,
        },
      ),
    );

    return () => {
      controller.abort();
    };
  }, [dispatch, tablePage, pageSize]);

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
        <Title>Beneficiaries</Title>
      </div>

      <BeneficiariesTable data={tableData} loading={loading} />

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
